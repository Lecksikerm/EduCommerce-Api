import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { AdminInvitation } from '../dal/entities/admin-invitation.entity';
import { Admin } from '../dal/entities/admin.entity';
import { InviteAdminDto } from '../auth/dto/invite-admin.dto';
import { VerifyOtpDto } from '../auth/dto/verify-otp.dto';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AdminInvitationService {
  private readonly logger = new Logger(AdminInvitationService.name);

  constructor(
    @InjectRepository(AdminInvitation)
    private readonly inviteRepo: Repository<AdminInvitation>,
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
    private readonly mailService: MailService,
  ) {}

  // Invite new admin
  async inviteAdmin(dto: InviteAdminDto, currentAdmin: Admin) {
    if (currentAdmin.role !== 'superadmin') {
      throw new ForbiddenException('Only Super Admins can send invitations');
    }

    // Check if email already exists as an admin
    const existingAdmin = await this.adminRepo.findOne({ where: { email: dto.email } });
    if (existingAdmin) {
      throw new ConflictException('This email already belongs to an existing admin');
    }

    // Check existing invitation
    const existingInvite = await this.inviteRepo.findOne({ where: { email: dto.email } });
    if (existingInvite) {
      if (existingInvite.expiresAt > new Date()) {
        throw new ConflictException('An active invitation already exists for this email');
      } else {
        // Delete expired invitation
        await this.inviteRepo.delete(existingInvite.id);
      }
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const hashedOtp = await bcrypt.hash(otp, 10);

    const invite = this.inviteRepo.create({
      email: dto.email,
      name: dto.name,
      otp: hashedOtp,
      expiresAt,
    });

    await this.inviteRepo.save(invite);

    // Send OTP email
    try {
      await this.mailService.sendMail(
        dto.email,
        'EduCommerce Admin Invitation OTP',
        `Your OTP is ${otp}. It will expire in 10 minutes.`,
        `<p>Your OTP is <strong>${otp}</strong>. It will expire in <strong>10 minutes</strong>.</p>`,
      );
    } catch (err) {
      this.logger.error(`Failed to send OTP to ${dto.email}: ${err.message}`);
      throw new BadRequestException('Failed to send invitation email');
    }

    return { success: true, message: `OTP sent to ${dto.email}`, expiresAt };
  }

  // Verify OTP and create admin
  async verifyOtp(dto: VerifyOtpDto) {
    const invitation = await this.inviteRepo.findOne({ where: { email: dto.email } });
    if (!invitation) throw new NotFoundException('No invitation found for this email');
    if (invitation.expiresAt < new Date()) throw new BadRequestException('OTP has expired');

    const isValid = await bcrypt.compare(dto.otp, invitation.otp);
    if (!isValid) throw new BadRequestException('Invalid OTP');

    const newAdmin = this.adminRepo.create({
      name: dto.name,
      email: dto.email,
      password: await bcrypt.hash(dto.password, 10),
      role: 'admin',
    });

    await this.adminRepo.save(newAdmin);
    await this.inviteRepo.delete(invitation.id);

    return {
      success: true,
      message: 'Admin successfully registered via invitation',
      admin: {
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    };
  }

  // Resend OTP
  async resendOtp(email: string) {
    const invitation = await this.inviteRepo.findOne({ where: { email } });
    if (!invitation) throw new NotFoundException('No pending invitation for this email');
    if (invitation.expiresAt < new Date()) throw new BadRequestException('Invitation has expired');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    invitation.otp = await bcrypt.hash(otp, 10);
    invitation.expiresAt = expiresAt;

    await this.inviteRepo.save(invitation);

    await this.mailService.sendMail(
      email,
      'EduCommerce Admin OTP Resend',
      `Your new OTP is ${otp}. It will expire in 10 minutes.`,
      `<p>Your new OTP is <strong>${otp}</strong>. It will expire in <strong>10 minutes</strong>.</p>`,
    );

    return { success: true, message: 'New OTP sent successfully', expiresAt };
  }

  // Cleanup expired invitations
  @Cron(CronExpression.EVERY_30_MINUTES)
  async cleanExpiredInvites() {
    const now = new Date();
    const result = await this.inviteRepo.delete({ expiresAt: LessThan(now) });
    if (result.affected > 0) {
      this.logger.log(`Cleaned up ${result.affected} expired invitations.`);
    }
  }
}


