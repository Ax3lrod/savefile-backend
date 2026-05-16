import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SteamService } from './steam.service';
import { PrismaService } from '../prisma.service';
import { SyncService } from './sync.service';

@Module({
  imports: [HttpModule],
  providers: [SteamService, SyncService],
  exports: [SteamService],
})
export class SteamModule {}
