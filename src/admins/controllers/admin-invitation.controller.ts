import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { 
  ApiBearerAuth, 
  ApiOperation, 
  ApiResponse, 
  ApiTags 
} from '@nestjs/swagger';

import { ResendOtpDto } from 'src/auth/dto/resend-otp.dto';
import { VerifyOtpDto } from 'src/auth/dto/verify-otp.dto';
import { AdminInvitationService } from '../admin-invitation.service';
import { InviteAdminDto } from 'src/auth/dto/invite-admin.dto';
import { AdminGuard } from '../admin.guard';

@ApiTags('Admin Invitations')
@Controller('admin/invitations')
export class AdminInvitationController {
  constructor(private readonly invitationService: AdminInvitationService) {}

  @Post('/invite')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Invite a new admin (SuperAdmin only)' })
  @ApiResponse({ status: 201, description: 'Sends OTP email to invited admin' })
  async invite(@Body() dto: InviteAdminDto, @Request() req) {
    const currentAdmin = req.user; 
    return this.invitationService.inviteAdmin(dto, currentAdmin);
  }

  @Post('/resend')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Resend OTP for a pending admin invitation (SuperAdmin only)' })
  @ApiResponse({ status: 200, description: 'Resends OTP email if invitation still valid' })
  async resend(@Body() dto: ResendOtpDto, @Request() req) {
    const currentAdmin = req.user; 
    return this.invitationService.resendOtp(dto.email);
  }

  @Post('/verify-otp')
  @ApiOperation({ summary: 'Verify OTP and create admin account' })
  @ApiResponse({ status: 200, description: 'Verifies OTP and registers admin' })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.invitationService.verifyOtp(dto);
  }
}

