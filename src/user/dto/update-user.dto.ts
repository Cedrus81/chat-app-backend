import { IsOptional, IsString, IsUrl, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  photo?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)
  @IsOptional()
  phone?: string;
}
