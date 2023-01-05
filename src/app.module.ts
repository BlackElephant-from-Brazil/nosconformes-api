import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from 'src/config/configuration';
import { databaseConfigurations } from 'src/providers/database/typeorm-datasource';
import { DataSource } from 'typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfigurations),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
