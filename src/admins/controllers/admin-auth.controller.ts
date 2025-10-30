import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  ForbiddenException,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

import { CreateAdminDto, LoginAdminDto } from '../dto/admin.dto';


import { AdminJwtAuthGuard } from 'src/auth/guards/admin-jwt.guard';
import { AdminGuard } from '../admin.guard';
import { AdminAuthService } from '../services/admin.auth.service';
import { ResetPasswordDto, UpdateInitialPasswordDto } from '../dto/password-dto';

@ApiTags('Admin Auth')
@Controller('/admin/auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) { }

  @Post('/invite')
  @ApiBearerAuth()
  @UseGuards( AdminGuard)
  @ApiOperation({ summary: 'Invite a new admin (Superadmin only)' })
  @ApiBody({ type: CreateAdminDto })
  @ApiResponse({
    status: 201,
    description: 'Invitation email sent with temporary password',
    schema: {
      example: {
        success: true,
        message: 'Invitation sent to john@gmail.com',
      },
    },
  })
  async inviteAdmin(@Body() dto: CreateAdminDto, @Req() req) {
    if (req.user.role !== 'superadmin') {
      throw new ForbiddenException('Only superadmins can invite admins');
    }
    return this.adminAuthService.inviteAdmin(dto, req.user);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin login using temp or normal password' })
  @ApiBody({ type: LoginAdminDto })
  @ApiResponse({
    status: 200,
    description: 'Returns JWT token and admin details',
    schema: {
      example: {
        success: true,
        message: 'Login successful',
        data: {
          access_token: 'jwt-token',
          admin: {
            id: 'uuid',
            name: 'John Doe',
            email: 'john@gmail.com',
            role: 'admin',
            isVerified: true,
          },
        },
      },
    },
  })
  async login(@Body() dto: LoginAdminDto) {
    return this.adminAuthService.login(dto);
  }

  @Patch('/password')
  @ApiBearerAuth()
  @UseGuards(AdminJwtAuthGuard)
  @ApiOperation({
    summary:
      'Update initial temporary password (first-time verification after invite)',
  })
  @ApiBody({ type: UpdateInitialPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password updated successfully and account verified',
    schema: {
      example: {
        success: true,
        message: 'Password updated and account verified',
      },
    },
  })
  async updateInitialPassword(@Req() req, @Body() dto: UpdateInitialPasswordDto) {
    const adminId = req.user.sub;
    return this.adminAuthService.updateInitialPassword(adminId, dto);
  }
  @Post('/forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset OTP via email' })
  @ApiBody({
    schema: {
      example: { email: 'john@gmail.com' },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'OTP sent successfully to the registered email',
    schema: {
      example: {
        success: true,
        message: 'OTP sent to your email',
      },
    },
  })
  async requestPasswordReset(@Body('email') email: string) {
    return this.adminAuthService.requestPasswordReset(email);
  }

  @Post('/reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password using OTP' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
    schema: {
      example: {
        success: true,
        message: 'Password reset successfully',
      },
    },
  })
  async resetPasswordWithOtp(@Body() dto: ResetPasswordDto) {
    return this.adminAuthService.resetPasswordWithOtp(dto);
  }

}
