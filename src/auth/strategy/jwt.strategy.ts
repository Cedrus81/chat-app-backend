import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

const jwtFromCookie = (req: any) => {
  if (req && req.cookies) {
    return req.cookies['jwt'];
  }
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: jwtFromCookie,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: number; email: string }) {
    // if the user is null a 401 unauthorized error will display
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });
    // must have a function called 'validate'
    //under the hood, nestJs appends the given payload into the request
    delete user.hash;
    return user;
  }
}
