import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceRolesGuard } from '../auth/guards/workspace-roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@marcaflow/database';

@UseGuards(JwtAuthGuard, WorkspaceRolesGuard)
@Controller('workspaces/:workspaceId/brands/:brandId/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Roles(Role.OWNER, Role.ADMIN, Role.EDITOR)
  @Post()
  create(
    @Param('workspaceId') workspaceId: string,
    @Param('brandId') brandId: string,
    @Body() createPostDto: any,
  ) {
    return this.postsService.create(workspaceId, brandId, createPostDto);
  }

  @Roles(Role.OWNER, Role.ADMIN, Role.EDITOR, Role.VIEWER)
  @Get()
  findAll(@Param('brandId') brandId: string) {
    return this.postsService.findAllByBrand(brandId);
  }

  @Roles(Role.OWNER, Role.ADMIN, Role.EDITOR, Role.VIEWER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Roles(Role.OWNER, Role.ADMIN, Role.EDITOR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: any) {
    return this.postsService.update(id, updatePostDto);
  }

  @Roles(Role.OWNER, Role.ADMIN, Role.EDITOR)
  @Post(':id/captions')
  addCaption(
    @Param('id') id: string,
    @Body() body: { text: string; isAi: boolean },
  ) {
    return this.postsService.addCaption(id, body.text, body.isAi);
  }
}
