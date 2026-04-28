import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { WorkspacesModule } from './workspaces/workspaces.module';

import { PrismaModule } from './prisma/prisma.module';
import { BrandsModule } from './brands/brands.module';
import { UploadsModule } from './uploads/uploads.module';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AiModule } from './ai/ai.module';
import { PostsModule } from './posts/posts.module';
import { TemplatesModule } from './templates/templates.module';
import { CalendarModule } from './calendar/calendar.module';
import { AdminModule } from './admin/admin.module';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads/',
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    WorkspacesModule,
    BrandsModule,
    UploadsModule,
    AiModule,
    PostsModule,
    TemplatesModule,
    CalendarModule,
    AdminModule,
    SchedulerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
