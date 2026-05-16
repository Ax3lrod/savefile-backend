import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateReviewDto } from './create-review.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async createOrUpdateReview(userId: string, dto: CreateReviewDto) {
    return this.prisma.review.upsert({
      where: {
        userId_gameId: {
          userId: userId,
          gameId: dto.gameId,
        },
      },
      update: {
        rating: dto.rating,
        content: dto.content,
      },
      create: {
        userId: userId,
        gameId: dto.gameId,
        rating: dto.rating,
        content: dto.content,
      },
    });
  }

  // Ambil semua review di app
  async getAllReviews() {
    return this.prisma.review.findMany({
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        game: {
          select: {
            name: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
