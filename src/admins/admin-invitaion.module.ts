import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminInvitationService } from './admin-invitation.service';
import { AdminInvitation } from 'src/dal/entities/admin-invitation.entity';
import { MailService } from 'src/mail/mail.service';
import { AdminInvitationController } from './controllers/admin-invitation.controller';
import { Admin } from 'src/dal/entities/admin.entity';

@Module({
    imports: [TypeOrmModule.forFeature([AdminInvitation, Admin])],
    controllers: [AdminInvitationController],
    providers: [AdminInvitationService, MailService],
    exports: [AdminInvitationService],
})
export class AdminInvitationModule { }
