import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class PasswordDto {
  @ApiProperty({
    example: 'password123',
    description: 'Password must be between 6 and 64 characters long',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(64, { message: 'Password must not exceed 64 characters' })
  password: string;
}

export class CreateStudentDto extends PasswordDto {
  @ApiProperty({
    example: 'adeola@gmail.com',
    description: 'Valid email address of the student',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    example: 'Adeola',
    description: 'First name of the student',
  })
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  @MaxLength(15, { message: 'First name must not exceed 15 characters' })
  firstName: string;

  @ApiProperty({
    example: 'Solape',
    description: 'Last name of the student',
  })
  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  @MaxLength(15, { message: 'Last name must not exceed 15 characters' })
  lastName: string;

  @ApiProperty({
    example: '08012345678',
    description: 'Phone number of the student',
  })
  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  phone: string;

  @ApiProperty({
    example: 'STU001',
    description: 'Matriculation number (optional)',
    required: false,
  })
  @IsString()
  @MaxLength(20)
  matricNo?: string;
}
export class StudentLoginDto extends PasswordDto {
  @ApiProperty({
    example: 'adeola@gmail.com',
    description: 'Email address of the student',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

}
