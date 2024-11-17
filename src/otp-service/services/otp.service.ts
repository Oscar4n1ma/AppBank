import { Injectable } from '@nestjs/common';

@Injectable()
export class OtpService {
  generateOtp(): number {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
  }

  isOtpExpired(createdAt: Date, expirationMinutes: number): boolean {
    const now = new Date();
    const expirationTime = new Date(
      createdAt.getTime() + expirationMinutes * 60000,
    );
    return now > expirationTime;
  }
}
