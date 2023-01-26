import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

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

	await app.listen(process.env.PORT || 3333);
	console.log(
		`NOSCONFORMES: Application is now running on port: ${
			process.env.PORT || 3333
		}!!!`,
	);
}

bootstrap();
