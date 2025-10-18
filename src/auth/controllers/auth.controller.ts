import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

import { CreateStudentDto } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth')
@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'Register a new student account' })
  @ApiBody({ type: CreateStudentDto })
  @ApiResponse({
    status: 201,
    description: 'Student registered successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or bad request',
  })
  async signup(@Body() dto: CreateStudentDto) {
    return this.authService.register(dto);
  }
}
