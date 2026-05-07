import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SteamService } from './steam.service';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly steamService: SteamService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleAutomatedSync() {
    this.logger.debug(`Starting automated Steam sync for all users...`);

    // 1. Ambil semua user yang punya steamId dari db
    const users = await this.prisma.user.findMany({
      where: {
        steamId: { not: null },
      },
      select: {
        id: true,
        steamId: true,
        username: true,
      },
    });

    this.logger.debug(`Found ${users.length} users with Steam IDs to sync.`);

    // 2. Loop dan jalankan sync untuk masing-masing user
    for (const user of users) {
      if (user.steamId) {
        try {
          this.logger.debug(
            `Syncing games for user ${user.username} (SteamID: ${user.steamId})...`,
          );
          await this.steamService.syncUserGames(user.steamId, user.id);
          this.logger.debug(`Finished syncing user ${user.username}.`);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          this.logger.error(
            `Error syncing user ${user.username}: ${errorMessage}`,
          );
        }
      }
    }

    this.logger.debug(`Completed automated Steam sync for all users.`);
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleGameEnrichment() {
    const stubGames = await this.prisma.game.findMany({
      where: { isStub: true },
      take: 5, // Batasi jumlah game yang diproses per batch untuk menghindari rate limit
    });

    if (stubGames.length === 0) {
      this.logger.debug('No stub games found for enrichment.');
      return;
    }

    this.logger.debug(
      `Enriching details for ${stubGames.length} stub games...`,
    );

    for (const game of stubGames) {
      await this.steamService.enrichGameDetails(game.steamAppId);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay 1 detik antar request untuk menghindari rate limit
    }
  }

  // Opsional: Jalankan sync sekali saat aplikasi mulai
  async onModuleInit() {
    this.logger.log('Running initial Steam sync on module init...');

    // Jalankan sync sekali saat aplikasi mulai
    await this.handleAutomatedSync();
  }
}
