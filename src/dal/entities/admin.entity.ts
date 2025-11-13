import { Entity, Column } from 'typeorm';
import { Base } from './base.entity';
import { Exclude } from 'class-transformer';


@Entity('admins')
export class Admin extends Base {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ default: 'admin' })
  role: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'uuid', nullable: true })
  invitedBy?: string;
}


