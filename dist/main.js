"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    const documentConfiguration = new swagger_1.DocumentBuilder()
        .setTitle('NOSCONFORMES API')
        .setDescription('API of project NOSCONFORMES. Created By BlackElephant from Brazil.')
        .setVersion('0.0.1')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, documentConfiguration);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(process.env.PORT || 3333);
    console.log(`NOSCONFORMES: Application is now running on port: ${process.env.PORT || 3333}!!!`);
}
bootstrap();
//# sourceMappingURL=main.js.map