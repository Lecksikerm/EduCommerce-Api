import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { StudentsModule } from '../students/students.module';
import { BcryptService } from './services/bcrypt.service';

@Module({
  imports: [StudentsModule], 
  providers: [AuthService, BcryptService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

