import {
  Injectable,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Admin } from '../dal/entities/admin.entity';

@Injectable()
export class AdminGuard extends AuthGuard('admin-jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(
    err: any,
    user: TUser,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException('Admin authentication failed');
    }

    const admin = user as Admin;
    if (!admin.role || admin.role.toLowerCase() !== 'superadmin') {
      throw new ForbiddenException('Only Super Admins can access this route');
    }

    return user;
  }
}
