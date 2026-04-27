import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, PrismaClient } from '@marcaflow/database';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class WorkspaceRolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaClient,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Se não exige role, passa
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    // Pega o workspace_id dos params (/workspaces/:workspaceId/* ou no query/body)
    const workspaceId =
      request.params.workspaceId ||
      request.body.workspaceId ||
      request.query.workspaceId;

    if (!user || !workspaceId) {
      throw new ForbiddenException('Usuário ou WorkspaceId ausente.');
    }

    const member = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: user.sub, // 'sub' injetado via JWT guard
        },
      },
    });

    if (!member) {
      throw new ForbiddenException('Usuário não pertence a este Workspace.');
    }

    const hasRole = requiredRoles.includes(member.role);
    if (!hasRole) {
      throw new ForbiddenException(
        `Ação requer uma das roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
