import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	app.enableCors();

	const documentConfiguration = new DocumentBuilder()
		.setTitle('NOSCONFORMES API')
		.setDescription(
			'API of project NOSCONFORMES. Created By BlackElephant from Brazil.',
		)
		.setVersion('0.0.1')
		.build();

	const document = SwaggerModule.createDocument(app, documentConfiguration);
	SwaggerModule.setup('api', app, document, {
		customSiteTitle: 'NOSCONFORMES - API',
	});

	app.useGlobalPipes(new ValidationPipe());

	app.setBaseViewsDir(join(__dirname, 'views'));
	app.setViewEngine('hbs');

	await app.listen(process.env.PORT || 3000);
	console.log(
		`NOSCONFORMES: Application is now running on port: ${
			process.env.PORT || 3000
		}!!!`,
	);
}

bootstrap();
