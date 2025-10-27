import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../dal/entities/admin.entity';
import { AdminService } from './admin.service';

import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { AdminAuthModule } from './admin.authmodule';
import { AdminAuthController } from './controllers/admin-auth.controller';
import { AdminController } from './controllers/admin.controller';
import { AdminInvitationModule } from './admin-invitaion.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Admin]),
        forwardRef(() => AuthModule),
        AdminAuthModule,
        AdminInvitationModule,
    ],
    controllers: [AdminController, AdminAuthController],
    providers: [AdminService],
    exports: [AdminService],
})
export class AdminModule { }