import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Query,
  Req,
  ForbiddenException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';


import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { AdminJwtAuthGuard } from 'src/auth/guards/admin-jwt.guard';
import { AdminGuard } from '../admin.guard';
import { AdminService } from '../services/admin.service';
import { CreateAdminDto } from '../dto/admin.dto';
import { PaginationDto } from '../dto/pagination.dto';


@ApiTags('Admins')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Get('/all')
  @ApiBearerAuth()
  @UseGuards(AdminJwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Get paginated list of all admins (Super Admin only)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false, example: 'john' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of admins',
    schema: {
      example: {
        data: [
          {
            id: 'uuid-string',
            name: 'John Doe',
            email: 'admin@example.com',
            createdAt: '2025-10-25T20:10:00.000Z',
          },
        ],
        total: 25,
        page: 1,
        limit: 10,
        totalPages: 3,
      },
    },
  })
  async getAllAdmins(
    @Query() paginationDto: PaginationDto,
    @Req() req,
  ) {
    if (req.user.role !== 'superadmin') {
      throw new ForbiddenException('Only Super Admins can access this route');
    }

    const { page, limit, search } = paginationDto;
    return this.adminService.findAllPaginated(+page, +limit, search);
  }

  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(AdminJwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Get single admin by ID (Super Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Returns details of a specific admin',
    schema: {
      example: {
        id: 'uuid-string',
        name: 'John Doe',
        email: 'admin@example.com',
        createdAt: '2025-10-25T20:10:00.000Z',
      },
    },
  })
  async getAdmin(@Param('id') id: string, @Req() req) {
    if (req.user.role !== 'superadmin') {
      throw new ForbiddenException('Only Super Admins can access this route');
    }

    return this.adminService.findOne(id);
  }
}


