import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { Response } from 'express';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @GetUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { updatedUser, access_token } = await this.userService.update(
      user,
      updateUserDto
    );
    res.cookie('jwt', access_token);
    return updatedUser;
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) userId: number,
    @Res({ passthrough: true }) res: Response
  ) {
    res.clearCookie('jwt');
    return this.userService.remove(userId);
  }
}
