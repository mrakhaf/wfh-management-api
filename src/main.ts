import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
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