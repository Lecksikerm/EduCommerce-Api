import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Student } from './src/dal/entities/student.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'educommerce',
  entities: [Student],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, 
});
