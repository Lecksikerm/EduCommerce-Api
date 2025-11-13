import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Admin } from 'src/dal/entities/admin.entity';
import { PaginationDto } from '../dto/pagination.dto';
import { CreateAdminDto } from '../dto/admin.dto';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Admin)
        private readonly adminRepo: Repository<Admin>,
    ) { }

    async findAllPaginated(page = 1, limit = 10, search?: string) {
        const skip = (page - 1) * limit;

        const where = search
            ? [
                { name: ILike(`%${search}%`) },
                { email: ILike(`%${search}%`) },
            ]
            : {};

        const [data, total] = await this.adminRepo.findAndCount({
            where,
            order: { createdAt: 'DESC' },
            skip,
            take: limit,
            select: ['id', 'name', 'email', 'role', 'isVerified', 'createdAt'],
        });

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findOne(id: string) {
        const admin = await this.adminRepo.findOne({
            where: { id },
            select: ['id', 'name', 'email', 'role', 'isVerified', 'createdAt'],
        });

        if (!admin) throw new NotFoundException('Admin not found');
        return admin;
    }
    async createAdmin(dto: CreateAdminDto) {
        const existing = await this.adminRepo.findOne({ where: { email: dto.email } });
        if (existing) throw new NotFoundException('Admin with this email already exists');

        const admin = this.adminRepo.create({
            name: dto.name,
            email: dto.email,
            password: dto.password,
            role: dto.role ?? 'admin',
            isVerified: true,
        });

        await this.adminRepo.save(admin);
        return { success: true, message: 'Admin created successfully', admin };
    }
}


