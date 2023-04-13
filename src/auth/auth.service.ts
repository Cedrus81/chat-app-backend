import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SigninDto, SignupDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}
  async signup(dto: SignupDto) {
    if (!dto.email || !dto.password)
      throw new BadRequestException('Missing email or password');
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name || dto.email.split('@')[0],
          bio: dto.bio || '',
          phone: dto.phone || '',
          photo: dto.photo || '',
          hash,
        },
      });
      delete user.hash;
      const { access_token } = await this.signToken(user.id, user.email);

      return { user, access_token };
    } catch (err) {
      if (
        // err instanceof PrismaClientKnownRequestError &&
        err?.code === 'P2002'
      ) {
        throw new ForbiddenException('These credentials are already taken');
      }
      throw err;
    }
  }

  async signin(dto: SigninDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new Error('Cannot login: User not found...');
    const pwMatches = await argon.verify(user.hash, dto.password);
    if (!pwMatches) throw new Error('Cannot login: Incorrect credentials...');
    delete user.hash;
    const { access_token } = await this.signToken(user.id, user.email);
    return { user, access_token };
  }

  async signToken(
    userId: number,
    email: string
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15h',
      secret: this.config.get('JWT_SECRET'),
    });
    return {
      access_token: token,
    };
  }
}
