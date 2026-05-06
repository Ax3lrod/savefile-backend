import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-steam';
import { ConfigService } from '@nestjs/config';

interface SteamUser {
  steamId: string;
  username: string;
  photos: { value: string }[];
}

@Injectable()
export class SteamStrategy extends PassportStrategy(Strategy, 'steam') {
  constructor(configService: ConfigService) {
    const apiKey = configService.getOrThrow<string>('STEAM_API_KEY') || '';
    const baseUrl =
      configService.getOrThrow<string>('BASE_URL') || 'http://localhost:3000';

    super({
      returnURL: `${baseUrl}/api/auth/steam/return`,
      realm: baseUrl,
      apiKey,
    });
  }

  validate(
    identifier: string,
    profile: Record<string, any>,
    done: (err: any, user: SteamUser | null) => void,
  ) {
    //console.log('DATA DARI STEAM:', profile);

    try {
      const user: SteamUser = {
        steamId: profile.id as string,
        username: profile.displayName as string,
        photos: profile.photos as { value: string }[],
      };
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
}
