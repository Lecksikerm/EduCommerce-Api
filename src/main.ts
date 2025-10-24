import * as crypto from 'crypto';
(global as any).crypto = crypto;

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('EduCommerce API')
    .setDescription(
      'EduCommerce API — a school e-commerce backend for students to buy books,other school materials and pay fees online.',
    )
    .setVersion('1.0')
    .addTag('Auth', 'Handles student authentication and registration')
    .addTag('Students', 'Manages student profiles and records')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'user-token')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);


  const PORT = process.env.PORT || 5000;
  await app.listen(PORT);

  console.log(` EduCommerce API running on http://localhost:${PORT}`);
  console.log(` Swagger Docs available at http://localhost:${PORT}/api/docs`);
}

bootstrap();

