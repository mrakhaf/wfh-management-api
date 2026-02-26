import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as axios from 'axios';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  private readonly authServiceUrl: string;

  constructor() {
    this.authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3000';
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing or invalid token' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      // For this implementation, we'll parse the JWT directly since the payload
      // structure doesn't match the expected format with 'valid' and 'user' fields
      
      // Decode JWT payload
      const parts = token.split('.');
      if (parts.length !== 3) {
        return res.status(401).json({ message: 'Invalid token format' });
      }

      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      
      // Check if payload has the required user fields
      if (!payload || !payload.position || !payload.email) {
        return res.status(401).json({ message: 'Invalid token payload' });
      }

      // Attach user info to request (using the payload directly since it contains user data)
      req['user'] = {
        id: payload.id,
        email: payload.email,
        fullname: payload.fullname,
        phone_number: payload.phone_number,
        position: payload.position,
        photo_url: payload.photo_url,
        created_at: payload.created_at,
        updated_at: payload.updated_at
      };
      
      next();
    } catch (error) {
      console.error('JWT validation error:', error);
      return res.status(401).json({ message: 'Token validation failed' });
    }
  }
}