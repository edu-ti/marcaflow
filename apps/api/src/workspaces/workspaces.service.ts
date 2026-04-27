import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaClient } from '@marcaflow/database';

@Injectable()
export class WorkspacesService {
  constructor(private prisma: PrismaClient) {}

  async create(createWorkspaceDto: any, userId: string) {
    const { name, slug } = createWorkspaceDto;
    return this.prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: { name, slug },
      });
      await tx.workspaceMember.create({
        data: {
          userId,
          workspaceId: workspace.id,
          role: 'OWNER',
        },
      });
      return workspace;
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.workspace.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        members: {
          where: { userId },
        },
      },
    });
  }

  async findOne(workspaceId: string, userId: string) {
    const workspace = await this.prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        members: {
          some: { userId },
        },
      },
    });

    if (!workspace) throw new ForbiddenException('Acesso negado');
    return workspace;
  }
}
