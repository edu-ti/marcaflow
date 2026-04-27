import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, Prisma } from '@marcaflow/database';

@Injectable()
export class CalendarService {
  constructor(private prisma: PrismaClient) {}

  async schedulePost(
    workspaceId: string,
    brandId: string,
    postId: string,
    scheduledAt: Date,
  ) {
    // Verifica primeiro
    const post = await this.prisma.post.findFirst({
      where: { id: postId, brandId, brand: { workspaceId } },
    });

    if (!post) throw new NotFoundException('Post inválido para agendamento.');

    return this.prisma.calendarItem.create({
      data: {
        brandId,
        postId,
        scheduledFor: new Date(scheduledAt),
        status: 'SCHEDULED',
      },
    });
  }

  async getBrandCalendar(brandId: string, startDate?: Date, endDate?: Date) {
    const whereClause: any = { brandId };

    if (startDate && endDate) {
      whereClause.scheduledFor = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    return this.prisma.calendarItem.findMany({
      where: whereClause,
      include: {
        post: { select: { title: true, status: true } },
      },
      orderBy: { scheduledFor: 'asc' },
    });
  }
}
