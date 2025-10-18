import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from 'src/dal/entities/student.entity';
import { CreateStudentDto } from 'src/auth/dto/auth.dto';

export type SafeStudent = Omit<Student, 'password'>;

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
  ) {}

  async create(dto: CreateStudentDto): Promise<Student> {
    const entity = this.studentRepo.create(dto as any) as unknown as Student;
    const saved = await this.studentRepo.save(entity as any);
    return saved as Student;
  }

  async findOne(id: string): Promise<SafeStudent> {
    return this.findById(id);
  }

  async findStudentByUsernameOrEmail(usernameOrEmail: string): Promise<Student | null> {
    const qb = this.studentRepo.createQueryBuilder('student');
    qb.where('student.username = :u', { u: usernameOrEmail })
      .orWhere('student.email = :u', { u: usernameOrEmail }) 
      .select([
        'student.id',
        'student.username',
        'student.email',
        'student.role',
        'student.password',
        'student.name',
      ]);

    const student = await qb.getOne();
    return student ?? null;
  }

  async findByEmail(email: string): Promise<Student | null> {
    return this.studentRepo.findOne({ where: { email } });
  }

  async findById(id: string): Promise<SafeStudent> {
    const student = await this.studentRepo.findOne({ where: { id } });
    if (!student) throw new NotFoundException(`Student with id ${id} not found`);

    const { password, ...safeStudent } = student;
    return safeStudent as SafeStudent;
  }

  async addStudent(student: Partial<Student>): Promise<SafeStudent> {
   
    const sAny = student as any;

    const existingEmail = await this.studentRepo.findOne({
      where: { email: sAny.email },
      select: ['email'] as any,
    });

    if (existingEmail) {
      throw new ConflictException(`Email '${existingEmail.email}' already exists`);
    }

    if (sAny.username) {
      const existingUsername = await this.studentRepo.findOne({
        where: [{ username: sAny.username } as any],
        select: ['username'] as any,
      });

      if (existingUsername) {
        throw new ConflictException(`Username '${(existingUsername as any).username}' already exists`);
      }
    }

    const newStudent = this.studentRepo.create(student as any);
    const savedStudent = await this.studentRepo.save(newStudent);

    const { password, ...safeStudent } = savedStudent as any;
    return safeStudent as SafeStudent;
  }

  async findAll(): Promise<SafeStudent[]> {
    const students = await this.studentRepo.find();

    return students.map((student) => {
      const { password, ...safeStudent } = student;
      return safeStudent as SafeStudent;
    });
  }
}