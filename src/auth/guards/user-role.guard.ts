import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators/role-protected.decorator';
import { User } from '@/users/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.getAllAndOverride<string[]>(
      META_ROLES,
      [context.getHandler(), context.getClass()],
    );

    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest<{ user: User }>();
    const user = req.user;

    if (!user) {
      throw new BadRequestException(
        'User not found (Make sure JwtAuthGuard is running first)',
      );
    }

    for (const role of user.roles) {
      if (validRoles.includes(role)) {
        return true; //* ¡Access granted!
      }
    }

    throw new ForbiddenException(
      `User ${user.fullName} needs a valid role: [${validRoles.join(', ')}]`,
    );
  }
}
