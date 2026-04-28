import { Processor, WorkerHost, inject } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaClient } from '@marcaflow/database';
import { SchedulerJobName, PublishPostJobData, RemindPostJobData } from './interfaces';

@Processor('scheduler')
export class SchedulerProcessor extends WorkerHost {
  private readonly logger = new Logger(SchedulerProcessor.name);

  private prisma = inject(PrismaClient);

  async process(job: Job<PublishPostJobData | RemindPostJobData>): Promise<void> {
    this.logger.log(`Processando job ${job.name} (${job.id})`);

    switch (job.name) {
      case SchedulerJobName.PUBLISH_POST:
        await this.handlePublishPost(job as Job<PublishPostJobData>);
        break;
      case SchedulerJobName.REMIND_POST:
        await this.handleRemindPost(job as Job<RemindPostJobData>);
        break;
      default:
        this.logger.warn(`Unknown job type: ${job.name}`);
    }
  }

  private async handlePublishPost(job: Job<PublishPostJobData>): Promise<void> {
    const { postId, brandId, workspaceId } = job.data;

    try {
      const scheduledJob = await this.prisma.scheduledJob.findFirst({
        where: { postId },
        orderBy: { createdAt: 'desc' },
      });

      if (scheduledJob) {
        await this.prisma.scheduledJob.update({
          where: { id: scheduledJob.id },
          data: { status: 'PROCESSING' },
        });
      }

      const post = await this.prisma.post.update({
        where: { id: postId },
        data: { status: 'PUBLISHED' },
        include: { brand: true },
      });

      await this.prisma.auditLog.create({
        data: {
          workspaceId,
          userId: 'system',
          action: 'PUBLISH_POST',
          entity: 'Post',
          entityId: postId,
          metadata: {
            brandName: post.brand?.name,
            publishedAt: new Date().toISOString(),
          },
        },
      });

      if (scheduledJob) {
        await this.prisma.scheduledJob.update({
          where: { id: scheduledJob.id },
          data: { status: 'COMPLETED' },
        });
      }

      this.logger.log(`Post ${postId} publicado com sucesso`);
    } catch (error) {
      const scheduledJob = await this.prisma.scheduledJob.findFirst({
        where: { postId },
        orderBy: { createdAt: 'desc' },
      });

      if (scheduledJob) {
        await this.prisma.scheduledJob.update({
          where: { id: scheduledJob.id },
          data: {
            status: 'FAILED',
            errorLog: error instanceof Error ? error.message : 'Unknown error',
          },
        });
      }

      throw error;
    }
  }

  private async handleRemindPost(job: Job<RemindPostJobData>): Promise<void> {
    const { postId, userId, message } = job.data;

    this.logger.log(
      `Lembrete para usuário ${userId}: Post ${postId} - ${message}`,
    );

    await this.prisma.auditLog.create({
      data: {
        workspaceId: 'system',
        userId,
        action: 'SEND_REMINDER',
        entity: 'Post',
        entityId: postId,
        metadata: { message },
      },
    });
  }
}