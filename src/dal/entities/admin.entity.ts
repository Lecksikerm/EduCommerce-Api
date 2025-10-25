import { Entity, Column } from 'typeorm';
import { Base } from './base.entity';


@Entity('admins')
export class Admin extends Base {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;
}
