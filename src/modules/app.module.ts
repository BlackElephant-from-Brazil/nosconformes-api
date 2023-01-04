import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import configuration from 'src/config/configuration';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CompaniesEntity } from './companies/companies.entity';
import { CompaniesModule } from './companies/company.module';
import { ManagersModule } from './managers/managers.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
      },
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: 'localhost',
        port: Number(process.env.POSTGRES_PORT) || 5432,
        username: String(process.env.POSTGRES_USERNAME),
        password: String(process.env.POSTGRES_PASSWORD),
        database: String(process.env.POSTGRES_DATABASE),
        entities: [CompaniesEntity],
        autoLoadEntities: true,
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    CompaniesModule,
    ManagersModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
