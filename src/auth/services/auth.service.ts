import {
    Injectable,
    ConflictException,
    UnauthorizedException,
} from '@nestjs/common';

import { StudentsService } from '../../students/students.service';
import * as bcrypt from 'bcrypt';
import { CreateStudentDto } from '../dto/auth.dto';

export type AuthInput = { email: string; password: string };

export type StudentSigninData = {
    studentId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    message: string;
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
    constructor(private readonly studentsService: StudentsService) { }

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
        const newStudent = await this.studentsService.create(createDto as unknown as CreateStudentDto);

        const { password: _, ...studentData } = newStudent;
        return {
            message: 'Student registered successfully',
            data: studentData,
        };
    }
    async signIn({ email, password }: AuthInput): Promise<StudentSigninData> {
        const student = await this.studentsService.findByEmail(email);
        if (!student) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const passwordMatches = await bcrypt.compare(password, student.password);
        if (!passwordMatches) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return {
            studentId: student.id,
            email: student.email,
            firstName: student.firstName,
            lastName: student.lastName,
            role: student.role,
            message: 'Sign-in successful',
        };
    }


}


