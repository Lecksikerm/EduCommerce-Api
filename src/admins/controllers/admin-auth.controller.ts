import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { AdminService } from '../admin.service';
import { LoginAdminDto } from '../admin.dto';


@ApiTags('Admin Auth')
@Controller('/admin/auth')
export class AdminAuthController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin login and get JWT token' })
  @ApiBody({ type: LoginAdminDto })
  @ApiResponse({
    status: 200,
    description: 'Returns JWT token and admin info',
    schema: {
      example: {
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        admin: {
          id: 'uuid-string',
          name: 'John Doe',
          email: 'admin@example.com',
          createdAt: '2025-10-25T20:10:00.000Z',
        },
      },
    },
  })
  async login(@Body() dto: LoginAdminDto) {
    return this.adminService.login(dto);
  }
}
