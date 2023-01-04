import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 3333);
  console.log(
    `NOSCONFORMES: Application is now running on port: ${
      process.env.PORT || 3333
    }!!!`,
  );
}
bootstrap();