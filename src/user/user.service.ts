import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async followUser(followerId: string, followingId: string) {
    // Prevent users from following themselves
    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself.');
    }

    return this.prisma.user.update({
      where: { id: followerId },
      data: {
        following: {
          connect: { id: followingId },
        },
      },
      select: {
        id: true,
        username: true,
        _count: {
          select: { following: true },
        },
      },
    });
  }

  async unfollowUser(followerId: string, followingId: string) {
    return this.prisma.user.update({
      where: { id: followerId },
      data: {
        following: {
          disconnect: { id: followingId },
        },
      },
      select: {
        id: true,
        username: true,
        _count: {
          select: { following: true },
        },
      },
    });
  }

  async getProfile(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        avatar: true,
        _count: {
          select: { followers: true, following: true, reviews: true },
        },
        reviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            game: {
              select: { name: true, imageUrl: true },
            },
          },
        },
      },
    });
  }
}
