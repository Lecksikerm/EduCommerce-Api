
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateInitialPasswordDto {
    @ApiProperty({ example: 'newStrongPass@2025' })
    @IsString()
    newPassword: string;
}

export class ResetPasswordDto {
    @ApiProperty({ example: 'admin@example.com' })
    @IsString()
    email: string;

    @ApiProperty({ example: '123456' })
    @IsString()
    otp: string;

    @ApiProperty({ example: 'newStrongPass@2025' })
    @IsString()
    newPassword: string;
}
