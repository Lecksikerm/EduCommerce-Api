import { Injectable } from '@nestjs/common';

interface OtpEntry {
  code: string;
  expiresAt: number;
}

@Injectable()
export class OtpService {
  private otpStore = new Map<string, OtpEntry>();

  async generateOtp(email: string): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; 
    this.otpStore.set(email, { code: otp, expiresAt });
    return otp;
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const entry = this.otpStore.get(email);
    if (!entry) return false;
    if (entry.expiresAt < Date.now()) {
      this.otpStore.delete(email);
      return false; 
    }
    const isValid = entry.code === otp;
    if (isValid) {
      this.otpStore.delete(email); 
    }
    return isValid;
  }
}

