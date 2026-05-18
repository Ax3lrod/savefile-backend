import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './create-review.dto';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import type { AuthenticatedRequest } from '../common/types/auth.types';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(AuthenticatedGuard)
  @ApiOperation({
    summary: 'Post or Update Review',
    description:
      'Allows an authenticated user to rate (1-5) and review a game. If a review already exists for this game/user combo, it will be updated.',
  })
  @ApiResponse({
    status: 201,
    description: 'Review successfully created or updated.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data (validation failed).',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. User must be logged in via Steam.',
  })
  async postReview(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateReviewDto,
  ) {
    const userId = req.user.id;
    return this.reviewService.createOrUpdateReview(userId, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get All Reviews',
    description:
      'Returns a list of all game reviews with associated user and game metadata.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of reviews returned successfully.',
  })
  async getAllReviews() {
    return this.reviewService.getAllReviews();
  }
}
