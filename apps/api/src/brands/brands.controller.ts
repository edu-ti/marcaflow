import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceRolesGuard } from '../auth/guards/workspace-roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@marcaflow/database';

@UseGuards(JwtAuthGuard, WorkspaceRolesGuard)
@Controller('workspaces/:workspaceId/brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Roles(Role.OWNER, Role.ADMIN, Role.EDITOR)
  @Post()
  create(
    @Param('workspaceId') workspaceId: string,
    @Body() createBrandDto: any,
  ) {
    return this.brandsService.create(workspaceId, createBrandDto);
  }

  @Roles(Role.OWNER, Role.ADMIN, Role.EDITOR, Role.VIEWER)
  @Get()
  findAll(@Param('workspaceId') workspaceId: string) {
    return this.brandsService.findAllByWorkspace(workspaceId);
  }

  @Roles(Role.OWNER, Role.ADMIN, Role.EDITOR, Role.VIEWER)
  @Get(':id')
  findOne(@Param('id') id: string, @Param('workspaceId') workspaceId: string) {
    return this.brandsService.findOne(id, workspaceId);
  }

  @Roles(Role.OWNER, Role.ADMIN, Role.EDITOR)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Param('workspaceId') workspaceId: string,
    @Body() updateBrandDto: any,
  ) {
    return this.brandsService.update(id, workspaceId, updateBrandDto);
  }
}
