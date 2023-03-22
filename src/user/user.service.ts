import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private auth: AuthService) {}

  findOne(userId: number) {
    return `This action returns a #${userId} user`;
  }

  async update(user: User, dto: UpdateUserDto) {
    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...user,
        ...dto,
      },
    });
    delete updatedUser.hash;
    const { access_token } = await this.auth.signToken(
      updatedUser.id,
      updatedUser.email
    );
    return { updatedUser, access_token };
  }

  remove(userId: number) {
    return this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }
}
