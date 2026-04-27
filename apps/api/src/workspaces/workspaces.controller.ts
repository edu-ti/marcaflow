import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  create(@Body() createWorkspaceDto: any, @Request() req) {
    return this.workspacesService.create(createWorkspaceDto, req.user.sub);
  }

  @Get()
  findAllByUser(@Request() req) {
    return this.workspacesService.findAllByUser(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    // Adicionar verificação de pertencimento
    return this.workspacesService.findOne(id, req.user.sub);
  }
}
