import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../dal/entities/admin.entity';
import { AdminService } from './services/admin.service';

import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { AdminAuthModule } from './admin.authmodule';
import { AdminAuthController } from './controllers/admin-auth.controller';
import { AdminController } from './controllers/admin.controller';
import { MailModule } from 'src/mail/mail.module';
import { OtpModule } from 'src/otp/otp.module';
import { AdminAuthService } from './services/admin.auth.service';


@Module({
    imports: [
        TypeOrmModule.forFeature([Admin]),
        forwardRef(() => AuthModule),
        AdminAuthModule,
        MailModule,
        OtpModule,

    ],
    controllers: [AdminController, AdminAuthController],
    providers: [AdminService, AdminAuthService],
    exports: [AdminService, AdminAuthService],
})
export class AdminModule { }