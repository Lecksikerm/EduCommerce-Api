import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { Student } from 'src/dal/entities/student.entity';
import { CreateStudentDto } from 'src/auth/dto/auth.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'; 

@ApiTags('Students')
@ApiBearerAuth('access-token') 
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  @ApiOperation({ summary: 'Get all students' })
  @ApiResponse({ status: 200, type: [Student] })
  async findAll() {
    return this.studentsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  @ApiOperation({ summary: 'Get student by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the student' })
  @ApiResponse({ status: 200, type: Student })
  async findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  @ApiOperation({ summary: 'Get current student profile' })
  @ApiResponse({
    status: 200,
    description: 'Returns the logged-in student details',
    type: Student,
  })
  async getMe(@Req() req) {
    const studentId = req.user.id;
    return this.studentsService.findOne(studentId);
  }
}

