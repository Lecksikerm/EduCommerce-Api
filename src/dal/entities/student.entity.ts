import { Entity, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Base } from './base.entity';

@Entity('students')
export class Student extends Base {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  matricNo: string;

  @Exclude()
  @Column()
  password: string;
    role: string;
}
