import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // MVP: No SaaS final, haveria uma flag `isSuperAdmin` no BD.
    // Aqui checamos hardcoded o e-mail setado na Seed.ts
    if (user && user.email === 'admin@marcaflow.com') {
      return true;
    }

    throw new ForbiddenException(
      'Acesso restrito a administradores da plataforma.',
    );
  }
}
