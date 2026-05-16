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
  @ApiOperation({ summary: 'Post a new review or update existing one' })
  @ApiResponse({ status: 201, description: 'Review successfully posted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async postReview(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateReviewDto,
  ) {
    const userId = req.user.id;
    return this.reviewService.createOrUpdateReview(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reviews' })
  @ApiResponse({ status: 200, description: 'Return all reviews.' })
  async getAllReviews() {
    return this.reviewService.getAllReviews();
  }
}
