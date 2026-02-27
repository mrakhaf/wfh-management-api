import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    // Enable CORS to handle preflight requests
  app.enableCors({
    origin: true, // Allow all origins (adjust as needed for production)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
  
  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // Apply JWT middleware globally
  app.use((req, res, next) => {
    // JWT middleware will be applied per route
    next();
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();