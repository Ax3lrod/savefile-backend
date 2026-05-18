import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import passport from 'passport';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaService } from './prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // Retrieve the already configured PrismaService
  const prismaService = app.get(PrismaService);

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
      name: 'savefile.sid',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      store: new PrismaSessionStore(prismaService as any, {
        checkPeriod: 2 * 60 * 1000, // Ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }),
      cookie: {
        maxAge: 360 * 60 * 1000, // 1 jam
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      },
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
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
