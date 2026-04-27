import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@marcaflow/database';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaClient) {}

  async getPlatformStats() {
    const [totalUsers, totalWorkspaces, totalBrands, totalPosts] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.workspace.count(),
        this.prisma.brand.count(),
        this.prisma.post.count(),
      ]);

    const users = await this.prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    return {
      metrics: { totalUsers, totalWorkspaces, totalBrands, totalPosts },
      recentUsers: users,
    };
  }

  async getAiLogs() {
    return this.prisma.aIRequestLog.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPlans() {
    return this.prisma.plan.findMany({
      include: { _count: { select: { subscriptions: true } } },
    });
  }
}
