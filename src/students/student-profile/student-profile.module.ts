import { Module } from '@nestjs/common';
import { StudentProfileController } from 'src/auth/controllers/student.profile.controller';
import { PassportJwtAuthGuard } from 'src/auth/guards/passport-jwt.guard';

@Module({
  controllers: [StudentProfileController],
  providers: [PassportJwtAuthGuard],
})
export class StudentProfileModule {}
