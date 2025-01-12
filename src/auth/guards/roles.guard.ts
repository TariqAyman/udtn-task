import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../common/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Retrieve the roles required for this route
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      // If no roles are specified, allow access
      return true;
    }

    // Extract the user from the request
    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      // If there's no user in the request, deny access
      throw new ForbiddenException('No user found in request');
    }

    if (!requiredRoles.includes(user.role)) {
      // If there's no user in the request, deny access
      throw new ForbiddenException('Insufficient role');
    }

    // Check if the user has any of the required roles
    return true;
  }
}
