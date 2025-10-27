import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @Length(6, 6)
  otp: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
  
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
