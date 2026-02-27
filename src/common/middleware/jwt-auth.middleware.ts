import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as axios from 'axios';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  private readonly authServiceUrl: string;

  constructor() {
    this.authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3000/check-token';
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing or invalid token' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      // Hit the external check-token API
      const response = await axios.default.get(this.authServiceUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = response.data;

      // Check if token is valid
      if (!result.valid) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      // Attach user info to request from the API response
      req['user'] = result.user;
      
      next();
    } catch (error) {
      console.error('JWT validation error:', error);
      return res.status(401).json({ message: 'Token validation failed' });
    }
  }
}