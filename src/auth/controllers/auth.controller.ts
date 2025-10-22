import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

import { CreateStudentDto, StudentLoginDto } from '../dto/auth.dto';
import { AuthService, StudentSigninData } from '../services/auth.service';

@ApiTags('Auth')
@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

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

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Student Sign-In' })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in',
    schema: {
      example: {
        studentId: 'd9b5f8b1-91a3-4b9f-b32a-2e94018bcbfa',
        email: 'adeola@gmail.com',
        firstName: 'Adeola',
        lastName: 'Solape',
        role: 'student',
        message: 'Sign-in successful',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: StudentLoginDto })
  async signIn(@Body() loginDto: StudentLoginDto): Promise<StudentSigninData> {
    return this.authService.signIn(loginDto);
  }

}
