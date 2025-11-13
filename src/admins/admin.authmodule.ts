import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../dal/entities/admin.entity';
import { AdminJwtStrategy } from '../auth/strategies/admin-jwt.strategy';
import { AdminModule } from './admin.module';

if (!process.env.JWT_ADMIN_SECRET) {
  throw new Error('Missing environment variable: JWT_ADMIN_SECRET');
}

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin]),
    PassportModule.register({ defaultStrategy: 'admin-jwt' }),
    JwtModule.register({
      secret: process.env.JWT_ADMIN_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    forwardRef(() => AdminModule),
  ],
  providers: [AdminJwtStrategy],
  exports: [JwtModule,
    PassportModule,
    TypeOrmModule,
    AdminJwtStrategy],
})
export class AdminAuthModule { }
