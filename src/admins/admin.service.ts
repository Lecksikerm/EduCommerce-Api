import {
    Injectable,
    UnauthorizedException,
    ConflictException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Admin } from '../dal/entities/admin.entity';
import { CreateAdminDto, LoginAdminDto } from './admin.dto';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Admin)
        private readonly adminRepo: Repository<Admin>,
        private readonly jwtService: JwtService,
    ) { }

    async createAdmin(dto: CreateAdminDto): Promise<Partial<Admin>> {
        const existingEmail = await this.adminRepo.findOne({
            where: { email: dto.email },
        });
        if (existingEmail) {
            throw new ConflictException('Admin with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const admin = this.adminRepo.create({
            ...dto,
            password: hashedPassword,
        });

        const savedAdmin = await this.adminRepo.save(admin);

        const { password, ...adminWithoutPassword } = savedAdmin;
        return adminWithoutPassword;
    }

    async validateAdmin(email: string, password: string): Promise<Admin> {
        const admin = await this.adminRepo.findOne({
            where: { email },
            select: ['id', 'email', 'name', 'password', 'role'],
        });

        if (!admin) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const isValid = await bcrypt.compare(password, admin.password);
        if (!isValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        return admin;
    }

    async login(dto: LoginAdminDto) {
        const admin = await this.validateAdmin(dto.email, dto.password);

        if (!process.env.JWT_ADMIN_SECRET) {
            throw new Error('Missing environment variable: JWT_ADMIN_SECRET');
        }
        const payload = {
            sub: admin.id,
            email: admin.email,
            role: admin.role,
        };

        const { password, ...adminWithoutPassword } = admin;

        return {
            access_token: this.jwtService.sign(payload, {
                secret: process.env.JWT_ADMIN_SECRET,
                expiresIn: '1d',
            }),
            admin: adminWithoutPassword,
        };
    }

    async findAllPaginated(page = 1, limit = 10, search = '') {
        const query = this.adminRepo.createQueryBuilder('admin');

        if (search) {
            query.where('admin.name ILIKE :search OR admin.email ILIKE :search', {
                search: `%${search}%`,
            });
        }

        query.orderBy('admin.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);

        const [data, total] = await query.getManyAndCount();

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }


    async findOne(id: string): Promise<Partial<Admin>> {
        const admin = await this.adminRepo.findOne({ where: { id } });
        if (!admin) {
            throw new NotFoundException('Admin not found');
        }

        const { password, ...adminWithoutPassword } = admin;
        return adminWithoutPassword;
    }
}




