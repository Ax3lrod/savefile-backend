import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { AuthenticatedRequest } from '../common/types/auth.types';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    // Extra safety check for the function existence to satisfy strict ESLint
    const isAuth =
      typeof request?.isAuthenticated === 'function' &&
      request.isAuthenticated();

    if (!isAuth) {
      throw new UnauthorizedException('Kamu harus login Steam dulu, Bro!');
    }

    return true;
  }
}
