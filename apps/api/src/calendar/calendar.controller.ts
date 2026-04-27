import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceRolesGuard } from '../auth/guards/workspace-roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@marcaflow/database';

@UseGuards(JwtAuthGuard, WorkspaceRolesGuard)
@Controller('workspaces/:workspaceId/brands/:brandId/calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Roles(Role.OWNER, Role.ADMIN, Role.EDITOR)
  @Post()
  schedulePost(
    @Param('workspaceId') workspaceId: string,
    @Param('brandId') brandId: string,
    @Body('postId') postId: string,
    @Body('scheduledAt') scheduledAt: string,
  ) {
    return this.calendarService.schedulePost(
      workspaceId,
      brandId,
      postId,
      new Date(scheduledAt),
    );
  }

  @Roles(Role.OWNER, Role.ADMIN, Role.EDITOR, Role.VIEWER)
  @Get()
  getCalendar(
    @Param('brandId') brandId: string,
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    return this.calendarService.getBrandCalendar(
      brandId,
      start ? new Date(start) : undefined,
      end ? new Date(end) : undefined,
    );
  }
}
