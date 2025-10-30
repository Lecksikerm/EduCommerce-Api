
import { Entity, Column } from 'typeorm';
import { Base } from './base.entity';

@Entity('otps')
export class Otp extends Base {
    @Column({ nullable: false })
    email: string;

    @Column({ name: 'otp', nullable: false })
    code: string;

    @Column({ name: 'expires_at', type: 'bigint', nullable: false })
    expiresAt: number;

    @Column({ default: false })
    used: boolean;
}
