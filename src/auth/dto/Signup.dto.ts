import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/)
  password: string;

  @IsString()
  @IsOptional()
  @Matches(/^(?:[A-Za-z]+(?:\s+[A-Za-z]+)*)?$/)
  name?: string;

  @IsString()
  @IsOptional()
  photo?: string;

  @IsString()
  @IsOptional()
  @Matches(/^.{25,}$|^$/)
  bio?: string;

  @IsString()
  @IsOptional()
  // @Matches(/^\+\d{1,4}-\d{10}$/) never tested; might cause problems
  phone?: string;
}
