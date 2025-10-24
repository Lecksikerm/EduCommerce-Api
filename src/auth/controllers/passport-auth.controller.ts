import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { StudentLoginDto } from '../dto/auth.dto';
import { PassportLocalGuard } from '../guards/passport-local-guard';
import { PassportJwtAuthGuard } from '../guards/passport-jwt.guard';

@ApiTags('Passport Student Auth')
@Controller('/v2/auth')
export class PassportAuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(PassportLocalGuard)
  @Post('/login')
  @ApiOperation({ summary: 'Student login using passport-local strategy' })
  @ApiBody({ type: StudentLoginDto })
  @ApiResponse({
    status: 200,
    description: 'Returns JWT token with student details',
  })
  async login(@Req() req: any) {
    return this.authService.signIn(req.user);
  }

  @UseGuards(PassportJwtAuthGuard)
  @Get('/me')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get currently logged-in student info' })
  @ApiResponse({
    status: 200,
    description: 'Returns student info from verified JWT token',
  })
  async getProfile(@Req() req: any) {
    console.log('Authenticated student:', req.user);
    return req.user;
  }
}
