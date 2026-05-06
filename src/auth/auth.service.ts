import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SteamUser, UserProfile } from '../common/types/auth.types';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async validateSteamUser(steamData: SteamUser): Promise<UserProfile> {
    const { steamId, username, photos } = steamData;
    const avatarUrl = photos[2]?.value || photos[0]?.value || null;

    const user = await this.prisma.user.upsert({
      where: { steamId },
      update: {
        username,
        avatar: avatarUrl,
      },
      create: {
        steamId,
        username,
        avatar: avatarUrl,
      },
      select: {
        id: true,
        username: true,
        steamId: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }
}
