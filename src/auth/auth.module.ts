import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SteamStrategy } from './steam.strategy';
import { PrismaService } from 'src/prisma.service';
import { SessionSerializer } from './session.serializer';

@Module({
  providers: [AuthService, SteamStrategy, SessionSerializer],
  controllers: [AuthController],
})
export class AuthModule {}
