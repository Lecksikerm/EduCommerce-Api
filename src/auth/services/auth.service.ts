import {
    Injectable,
    ConflictException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { StudentsService } from '../../students/students.service';
import { CreateStudentDto } from '../dto/auth.dto';

export type AuthInput = { email: string; password: string };

export type SigninData = {
    studentId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
};

export type AuthResult = {
    accessToken: string;
    studentId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
};

@Injectable()
export class AuthService {
    constructor(
        private readonly studentsService: StudentsService,
        private readonly jwtService: JwtService,
    ) { }

    async register(dto: CreateStudentDto) {
        const { email, password, firstName, lastName, phone, matricNo } = dto;

        const existing = await this.studentsService.findByEmail(email);
        if (existing) {
            throw new ConflictException('Student already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const createDto: Partial<CreateStudentDto> & { role?: string } = {
            email,
            firstName,
            lastName,
            phone,
            matricNo,
            password: hashedPassword,
            role: 'student',
        };

        const newStudent = await this.studentsService.create(
            createDto as unknown as CreateStudentDto,
        );

        const { password: _, ...studentData } = newStudent;
        return {
            message: 'Student registered successfully',
            data: studentData,
        };
    }

    async validateStudent(email: string, password: string) {
        const student = await this.studentsService.findByEmail(email);
        if (!student) return null;

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return null;

        return student;
    }

    async signIn(user: SigninData): Promise<AuthResult> {
        const payload = {
            sub: user.studentId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        };

        const accessToken = await this.jwtService.signAsync(payload);

        return {
            accessToken,
            studentId: user.studentId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        };
    }
}



