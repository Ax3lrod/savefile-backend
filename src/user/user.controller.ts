import type { AuthenticatedRequest } from './../common/types/auth.types';
import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Get User Profile',
    description:
      'Returns detailed user information, including follower counts and recent reviews.',
  })
  @ApiResponse({ status: 200, description: 'User profile found.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getProfile(@Param('id') id: string) {
    const user = await this.userService.getProfile(id);
    if (!user) throw new NotFoundException('User tidak ditemukan');
    return user;
  }

  @Post(':id/follow')
  @UseGuards(AuthenticatedGuard)
  @ApiOperation({
    summary: 'Follow User',
    description: 'Allows the logged-in user to follow another user.',
  })
  @ApiResponse({ status: 201, description: 'Successfully followed the user.' })
  @ApiResponse({ status: 400, description: 'Cannot follow yourself.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. User must be logged in.',
  })
  async follow(
    @Param('id') targetId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.userService.followUser(req.user.id, targetId);
  }

  @Delete(':id/follow')
  @UseGuards(AuthenticatedGuard)
  @ApiOperation({
    summary: 'Unfollow User',
    description:
      'Removes the follow relationship between the logged-in user and the target user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully unfollowed the user.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. User must be logged in.',
  })
  async unfollow(
    @Param('id') targetId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.userService.unfollowUser(req.user.id, targetId);
  }
}
