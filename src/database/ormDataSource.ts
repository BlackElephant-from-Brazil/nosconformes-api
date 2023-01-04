import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import path from 'path';
import {
  POSTGRES_DATABASE,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_USERNAME,
} from '../config/constants';

config();

const configService = new ConfigService();

export const dataSource = new DataSource({
  name: 'default',
  type: 'postgres',
  host: 'localhost',
  port: configService.get(POSTGRES_PORT) || 5432,
  username: configService.get(POSTGRES_USERNAME),
  password: configService.get(POSTGRES_PASSWORD),
  database: configService.get(POSTGRES_DATABASE),
  migrationsTableName: 'migrations',
  // entities: [
  //   path.resolve(__dirname, '..', 'modules', '**', '**.entity{.ts,.js}'),
  // ],
  // migrations: [path.resolve(__dirname, 'migrations', '*{.ts,.js}')],
  // subscribers: [path.resolve(__dirname, 'subscriber', '*{.ts,.js}')],
});
