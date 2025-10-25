import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto, LoginAdminDto } from './admin.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { AdminJwtAuthGuard } from 'src/auth/guards/admin-jwt.guard';
import { AdminGuard } from './admin.guard';

@ApiTags('Admins')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register a new admin' })
  @ApiBody({ type: CreateAdminDto })
  @ApiResponse({
    status: 201,
    description: 'Admin registered successfully',
    schema: {
      example: {
        id: "uuid-string",
        name: 'John Doe',
        email: 'admin@example.com',
        createdAt: '2025-10-25T20:10:00.000Z',
      },
    },
  })
  async register(@Body() dto: CreateAdminDto) {
    return this.adminService.createAdmin(dto);
  }

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
          id: "uuid-string",
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

  @Get('/all')
  @ApiBearerAuth()
  @UseGuards(AdminJwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Get list of all admins (protected)' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of all registered admins',
    schema: {
      example: [
        {
          id: "uuid-string",
          name: 'John Doe',
          email: 'admin@example.com',
          createdAt: '2025-10-25T20:10:00.000Z',
        },
      ],
    },
  })
  async getAllAdmins() {
    return this.adminService.findAll();
  }

  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(AdminJwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Get single admin by ID (protected)' })
  @ApiResponse({
    status: 200,
    description: 'Returns details of a specific admin',
    schema: {
      example: {
        id: "uuid-string",
        name: 'John Doe',
        email: 'admin@example.com',
        createdAt: '2025-10-25T20:10:00.000Z',
      },
    },
  })
  async getAdmin(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }
}

