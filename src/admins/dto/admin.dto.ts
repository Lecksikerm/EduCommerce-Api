import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, MaxLength, IsString } from 'class-validator';

export class CreateAdminDto {
    @ApiProperty({ example: 'admin1@gmail.com', description: 'Admin email' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'Oladejo Samson', description: 'Full name of the admin' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(60)
    name: string;

    @ApiProperty({ example: '1234560', description: 'Password 6-64 chars' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(64)
    password: string;

    @ApiProperty({ example: 'admin', description: 'Role of the user' })
    @IsString()
    @IsNotEmpty()
    role: string;
}

export class LoginAdminDto {
    @ApiProperty({ example: 'admin1@gmail.com', description: 'Admin email' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: '1234560', description: 'Password 6-64 chars' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(64)
    password: string;
}