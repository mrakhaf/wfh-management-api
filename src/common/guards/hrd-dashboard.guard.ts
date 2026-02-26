import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class HrdDashboardGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    
    // Check if user is already attached by JWT middleware
    if (!request['user']) {
      // If no user attached, it means JWT middleware validation failed
      // This should not happen if JWT middleware is properly configured
      return false;
    }

    // Check if user has HRD position
    if (request['user'].position !== 'hrd') {
      throw new ForbiddenException('Access denied: HRD position required');
    }

    // User is valid HRD, allow access
    return true;
  }
}
