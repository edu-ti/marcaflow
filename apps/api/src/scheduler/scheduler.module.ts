import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SchedulerService } from './scheduler.service';
import { SchedulerProcessor } from './scheduler.processor';
import { PrismaModule } from '../prisma/prisma.module';
import { PostsModule } from '../posts/posts.module';
import { BrandsModule } from '../brands/brands.module';
import { SchedulerJobName } from './interfaces';

@Module({
  imports: [
    ConfigModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
          password: configService.get('REDIS_PASSWORD'),
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'scheduler',
    }),
    PrismaModule,
    PostsModule,
    BrandsModule,
  ],
  providers: [SchedulerService, SchedulerProcessor],
  exports: [SchedulerService],
})
export class SchedulerModule {}