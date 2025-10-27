import { Entity, Column } from 'typeorm';
import { Base } from './base.entity';

@Entity('admin_invitations')
export class AdminInvitation extends Base{
  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  otp: string;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @Column({ default: false })
  isUsed: boolean;
}
