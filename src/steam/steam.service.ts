import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma.service';
import { SteamRecentlyPlayedResponse } from '../common/types/steam.types';

@Injectable()
export class SteamService {
  private readonly logger = new Logger(SteamService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async syncUserGames(steamId: string, userId: string): Promise<void> {
    const apiKey = this.configService.get<string>('STEAM_API_KEY');
    const url = `http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${apiKey}&steamid=${steamId}&format=json`;

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<SteamRecentlyPlayedResponse>(url),
      );

      const games = data.response.games || [];

      this.logger.log(
        `Found ${games.length} recently played games for user ${userId}`,
      );

      for (const game of games) {
        // 1. Ensure Game exists in DB (Lazy Import / Stub)
        const gameRecord = await this.prisma.game.upsert({
          where: { steamAppId: game.appid },
          update: { name: game.name },
          create: {
            steamAppId: game.appid,
            name: game.name,
            imageUrl: `https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/header.jpg`,
            isStub: true,
          },
        });

        // 2. Update Log (Playtime) for this User
        await this.prisma.log.upsert({
          where: {
            userId_gameId: {
              userId: userId,
              gameId: gameRecord.id,
            },
          },
          update: {
            playtimeForever: game.playtime_forever,
            lastSyncedAt: new Date(),
          },
          create: {
            userId: userId,
            gameId: gameRecord.id,
            playtimeForever: game.playtime_forever,
          },
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Failed to sync games for user ${userId}: ${errorMessage}`,
      );
    }
  }
}
