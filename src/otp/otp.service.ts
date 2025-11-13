import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Otp } from 'src/dal/entities/otp.entity';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepo: Repository<Otp>,
  ) { }

  async generateOtp(email: string): Promise<string> {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = Date.now() + 10 * 60 * 1000;

    await this.otpRepo.delete({ email });

    const otp = this.otpRepo.create({
      email,
      code: otpCode,
      expiresAt,
    });
    await this.otpRepo.save(otp);

    return otpCode;
  }

  async verifyOtp(email: string, code: string): Promise<boolean> {
    const record = await this.otpRepo.findOne({ where: { email, code } });

    if (!record) return false;

    const now = Date.now();

    if (record.expiresAt < Date.now()) return false;

    await this.otpRepo.update(record.id, { used: true });
    return true;
  }

  async cleanupExpiredOtps(): Promise<void> {
    await this.otpRepo.delete({ expiresAt: LessThan(Date.now()) });
  }
}



