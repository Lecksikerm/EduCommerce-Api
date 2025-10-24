import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });

    if (!configService.get<string>('JWT_SECRET')) {
      console.error('ERROR: JWT_SECRET not found in .env file');
      throw new Error('JWT_SECRET is missing — check your .env file');
    }
  }

  async validate(payload: any) {
    return {
      studentId: payload.sub,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      role: payload.role,
    };
  }
}



