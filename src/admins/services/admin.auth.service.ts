import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Admin } from '../../dal/entities/admin.entity';
import { CreateAdminDto, LoginAdminDto } from '../dto/admin.dto';
import { MailService } from 'src/mail/mail.service';
import { OtpService } from 'src/otp/otp.service';
import { UpdateInitialPasswordDto, ResetPasswordDto } from '../dto/password-dto';

@Injectable()
export class AdminAuthService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly otpService: OtpService,
  ) {}

  async inviteAdmin(dto: CreateAdminDto, inviter: any) {
    const existing = await this.adminRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Admin with this email already exists');

    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const newAdmin = this.adminRepo.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: 'admin',
      isVerified: false,
      invitedBy: inviter.id,
    });

    await this.adminRepo.save(newAdmin);

    await this.mailService.sendAdminInvitationEmail(newAdmin.email, {
      name: newAdmin.name,
      tempPassword,
      inviterName: inviter.name,
    });

    return {
      success: true,
      message: `Invitation sent to ${newAdmin.email}`,
    };
  }

  async login(dto: LoginAdminDto) {
    const admin = await this.adminRepo.findOne({
      where: { email: dto.email },
      select: ['id', 'email', 'name', 'password', 'role', 'isVerified'],
    });
    if (!admin) throw new UnauthorizedException('Invalid email or password');

    const isValid = await bcrypt.compare(dto.password, admin.password);
    if (!isValid) throw new UnauthorizedException('Invalid email or password');

    if (!admin.isVerified) {
      await this.adminRepo.update({ id: admin.id }, { isVerified: true });
    }

    const payload = { sub: admin.id, email: admin.email, role: admin.role };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_ADMIN_SECRET,
      expiresIn: '1d',
    });

    return {
      success: true,
      message: 'Login successful',
      data: {
        access_token: token,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          isVerified: true,
        },
      },
    };
  }

  async updateInitialPassword(adminId: string, dto: UpdateInitialPasswordDto) {
    if (!adminId) throw new BadRequestException('Invalid admin token');

    const admin = await this.adminRepo.findOne({ where: { id: adminId } });
    if (!admin) throw new NotFoundException('Admin not found');

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.adminRepo.update(
      { id: adminId },
      { password: hashedPassword, isVerified: true },
    );

    const updatedAdmin = await this.adminRepo.findOne({ where: { id: adminId } });

    const payload = {
      sub: updatedAdmin.id,
      email: updatedAdmin.email,
      role: updatedAdmin.role,
    };

    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_ADMIN_SECRET,
      expiresIn: '1d',
    });

    return {
      success: true,
      message: 'Password updated and account verified',
      data: {
        access_token: token,
        admin: {
          id: updatedAdmin.id,
          name: updatedAdmin.name,
          email: updatedAdmin.email,
          role: updatedAdmin.role,
          isVerified: updatedAdmin.isVerified,
        },
      },
    };
  }

  async requestPasswordReset(email: string) {
    const admin = await this.adminRepo.findOne({ where: { email } });
    if (!admin) throw new NotFoundException('Admin not found');

    const otp = await this.otpService.generateOtp(email);
    await this.mailService.sendPasswordResetOtp(email, otp);

    return { success: true, message: 'OTP sent to your email' };
  }

  async resetPasswordWithOtp(dto: ResetPasswordDto) {
    const admin = await this.adminRepo.findOne({ where: { email: dto.email } });
    if (!admin) throw new NotFoundException('Admin not found');

    const isValidOtp = await this.otpService.verifyOtp(dto.email, dto.otp);
    if (!isValidOtp) throw new BadRequestException('Invalid or expired OTP');

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.adminRepo.update({ id: admin.id }, { password: hashedPassword });

    return { success: true, message: 'Password reset successfully' };
  }
}


