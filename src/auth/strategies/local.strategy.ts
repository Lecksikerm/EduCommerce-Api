import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

   async validate(email: string, password: string): Promise<any> {
    const student = await this.authService.validateStudent(email, password);
    if (!student) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return student;
  }
}
