import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { SigninDto, SignupDto } from '../src/auth/dto';
import { inspect } from 'util';
import { UpdateUserDto } from 'src/user/dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    // now that we got the module compiled, we can run the app as test
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      })
    );
    await app.init();
    prisma = app.get(PrismaService);
    await prisma.cleanDB();
    pactum.request.setBaseUrl('http://localhost:3000');
  });
  afterAll(() => {
    app.close();
  });

  describe('Auth tests and User', () => {
    const signupDto: SignupDto = {
      email: 'vlad@gmail.com',
      password: '123',
    };
    let jwtCookie: string;
    describe('Signup', () => {
      it('Should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(signupDto)
          .expectStatus(201)
          .stores('newUserId', 'id');
      });

      it('Should throw; credentials taken', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(signupDto)
          .expectStatus(403);
      });

      it('Should throw; no email', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ password: signupDto.password })
          .expectStatus(400);
      });

      it('Should throw; no password', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: signupDto.email })
          .expectStatus(400);
      });
    });
    it('Should signin', async () => {
      return pactum
        .spec()
        .post('/auth/signin')
        .withBody({
          email: 'vlad@gmail.com',
          password: '123',
        })
        .expectStatus(200)
        .returns((ctx) => {
          jwtCookie = ctx.res.headers['set-cookie'][0].slice(4, -8);
        });
    });

    describe('User', () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Jafar',
        bio: 'My Name Is Jafar, I Come From Afar, I Have A Bomb In My Car, Allahu Akbar',
        photo:
          'https://fastly.picsum.photos/id/580/200/300.jpg?hmac=ETV-og2PgiTBmJBERthfeRRRuLpWGxM4Zq_3z8pXndA',
        phone: '+16308520397',
      };
      it('Shoud update user', () => {
        return pactum
          .spec()
          .patch('/users/{id}')
          .withCookies('jwt', jwtCookie)
          .withPathParams('id', '$S{newUserId}')
          .withBody(updateUserDto)
          .expectStatus(200)
          .returns((ctx) => {
            jwtCookie = ctx.res.headers['set-cookie'][0].slice(4, -8);
          })
          .inspect();
      });

      it('Should delete user', () => {
        return pactum
          .spec()
          .delete('/users/{id}')
          .withCookies('jwt', jwtCookie)
          .withPathParams('id', '$S{newUserId}')
          .expectStatus(200);
      });
    });
  });
});
