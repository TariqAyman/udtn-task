import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { useContainer, ValidationError } from 'class-validator';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // app use global pipes to automatically validate requests
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Enables automatic data transformation
      whitelist: true, // Strips properties without decorators
      forbidNonWhitelisted: true, // Throws an error if non-whitelisted properties are present
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Auth & Products API')
    .setDescription('API for user authentication and product management')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);

  app.enableCors({
    origin: true, // This allows all domains
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);

  console.log('Application is running on: http://localhost:3000');
}
bootstrap();
