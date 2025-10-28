import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Student } from './dal/entities/student.entity';
import { Admin } from './dal/entities/admin.entity';


dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'educommerce',
  entities: [Student, Admin],
  migrations: ['src/dal/migrations/*.ts'],
  synchronize: false,
});
