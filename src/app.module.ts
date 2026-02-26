import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { JwtAuthMiddleware } from './common/middleware/jwt-auth.middleware';

@Module({
  imports: [AttendanceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer.apply(JwtAuthMiddleware).forRoutes('attendance');
  }
}
