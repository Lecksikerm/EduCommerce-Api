import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

import { CreateStudentDto, StudentLoginDto } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';
import { AuthResult } from '../services/auth.service';
import { AuthGuard as  PassportAuthGuard } from '../guards/passport-jwt.guard';

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

  @UseGuards(PassportAuthGuard('local'))
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Student Sign-In (JWT Auth)' })
  @ApiBody({ type: StudentLoginDto })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in and returns JWT token',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        studentId: 'd9b5f8b1-91a3-4b9f-b32a-2e94018bcbfa',
        email: 'adeola@gmail.com',
        firstName: 'Adeola',
        lastName: 'Solape',
        role: 'student',
      },
    },
  })
 
 async login(@Req() req: any) {
    return this.authService.signIn(req.user);
  }
}