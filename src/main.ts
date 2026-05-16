import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import passport from 'passport';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // Swagger/OpenAPI Configuration
  const config = new DocumentBuilder()
    .setTitle('SaveFile API')
    .setDescription('The gaming activity logging platform API documentation')
    .setVersion('1.0')
    .addTag('savefile')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // Use Scalar instead of the default Swagger UI
  app.use(
    '/docs',
    apiReference({
      spec: {
        content: document,
      },
      theme: 'laserwave',
    }),
  );

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'default_secret',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 360 * 60 * 1000 }, // 1 jam
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
