import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { StudentsModule } from '../students/students.module';
import { BcryptService } from './services/bcrypt.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PassportLocalGuard } from './guards/passport-local-guard';
import { PassportAuthController } from './controllers/passport-auth.controller';

@Module({
  imports: [
    StudentsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') as any || '1d',
        },
      }),
    }),
  ],
  controllers: [AuthController, PassportAuthController],
  providers: [
    AuthService,
    BcryptService,
    LocalStrategy,
    JwtStrategy,
    JwtAuthGuard,
    PassportLocalGuard,
  ],
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}




