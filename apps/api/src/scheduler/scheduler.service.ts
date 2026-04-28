import { Injectable, Logger, inject } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@marcaflow/database';
import {
  SchedulerJobName,
  PublishPostJobData,
  RemindPostJobData,
} from './interfaces';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  private schedulerQueue = inject(Queue);
  private configService = inject(ConfigService);
  private prisma = inject(PrismaClient);

  async schedulePost(
    postId: string,
    brandId: string,
    workspaceId: string,
    scheduledFor: Date,
  ): Promise<string> {
    const delayMs = new Date(scheduledFor).getTime() - Date.now();

    if (delayMs <= 0) {
      throw new Error('A data de agendamento deve ser no futuro');
    }

    const existingJob = await this.prisma.scheduledJob.findFirst({
      where: { postId, status: { in: ['PENDING', 'PROCESSING'] } },
    });

    if (existingJob) {
      await this.cancelJob(existingJob.id);
    }

    const job = await this.schedulerQueue.add(
      SchedulerJobName.PUBLISH_POST,
      {
        postId,
        brandId,
        workspaceId,
        scheduledFor,
      } as PublishPostJobData,
      {
        delay: delayMs,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    );

    await this.prisma.scheduledJob.create({
      data: {
        postId,
        jobId: job.id,
        targetDate: scheduledFor,
        status: 'PENDING',
      },
    });

    this.logger.log(`Post ${postId} agendado para ${scheduledFor}`);

    return job.id;
  }

  async cancelJob(jobId: string): Promise<void> {
    const scheduledJob = await this.prisma.scheduledJob.findFirst({
      where: { jobId },
    });

    if (scheduledJob) {
      const queueJob = await this.schedulerQueue.getJob(scheduledJob.jobId);
      if (queueJob) {
        await queueJob.remove();
      }

      await this.prisma.scheduledJob.update({
        where: { id: scheduledJob.id },
        data: { status: 'CANCELLED' },
      });

      this.logger.log(`Job ${jobId} cancelado`);
    }
  }

  async reschedulePost(
    postId: string,
    newScheduledFor: Date,
  ): Promise<string> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new Error('Post não encontrado');
    }

    return this.schedulePost(
      postId,
      post.brandId,
      post.brand?.workspaceId || '',
      newScheduledFor,
    );
  }

  async getJobStatus(postId: string): Promise<{
    status: string;
    scheduledFor: Date | null;
    lastError: string | null;
  }> {
    const scheduledJob = await this.prisma.scheduledJob.findFirst({
      where: { postId },
      orderBy: { createdAt: 'desc' },
    });

    if (!scheduledJob) {
      return { status: 'NOT_SCHEDULED', scheduledFor: null, lastError: null };
    }

    let queueStatus = 'PENDING';
    if (scheduledJob.jobId) {
      const queueJob = await this.schedulerQueue.getJob(scheduledJob.jobId);
      if (queueJob) {
        queueStatus = queueJob.state;
      }
    }

    return {
      status: scheduledJob.status === 'CANCELLED' ? 'CANCELLED' : queueStatus,
      scheduledFor: scheduledJob.targetDate,
      lastError: scheduledJob.errorLog,
    };
  }

  async scheduleReminder(
    postId: string,
    userId: string,
    scheduledFor: Date,
    message: string,
  ): Promise<void> {
    const delayMs = new Date(scheduledFor).getTime() - Date.now();

    await this.schedulerQueue.add(
      SchedulerJobName.REMIND_POST,
      {
        postId,
        userId,
        message,
      } as RemindPostJobData,
      {
        delay: delayMs > 0 ? delayMs : 0,
        attempts: 2,
      },
    );
  }

  async retryFailedJob(jobId: string): Promise<void> {
    const scheduledJob = await this.prisma.scheduledJob.findFirst({
      where: { jobId },
    });

    if (!scheduledJob || scheduledJob.status !== 'FAILED') {
      throw new Error('Job não encontrado ou não falhou');
    }

    const post = await this.prisma.post.findUnique({
      where: { id: scheduledJob.postId },
    });

    if (!post) {
      throw new Error('Post não encontrado');
    }

    const newJobId = await this.schedulePost(
      scheduledJob.postId,
      post.brandId,
      post.brand?.workspaceId || '',
      scheduledJob.targetDate,
    );

    this.logger.log(`Job ${jobId} refeito como ${newJobId}`);
  }
}