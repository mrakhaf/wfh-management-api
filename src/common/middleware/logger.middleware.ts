import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    
    // Log request details
    this.logger.log(
      `[${new Date().toISOString()}] ${req.method} ${req.url}`
    );

    // Capture the original end method
    const originalEnd = res.end;
    
    // Override res.end to log after response is sent
    res.end = function(chunk?: any, encoding?: any) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      const statusCode = res.statusCode;
      
      // Determine log level based on status code
      if (statusCode >= 500) {
        this.logger.error(
          `[${new Date().toISOString()}] ${req.method} ${req.url} ${statusCode} ${responseTime}ms`
        );
      } else if (statusCode >= 400) {
        this.logger.warn(
          `[${new Date().toISOString()}] ${req.method} ${req.url} ${statusCode} ${responseTime}ms`
        );
      } else {
        this.logger.log(
          `[${new Date().toISOString()}] ${req.method} ${req.url} ${statusCode} ${responseTime}ms`
        );
      }
      
      // Call the original end method
      originalEnd.call(res, chunk, encoding);
    }.bind({ logger: this.logger });

    next();
  }
}
