export interface SteamRecentlyPlayedGame {
  appid: number;
  name: string;
  playtime_2weeks: number;
  playtime_forever: number;
  img_icon_url: string;
}

export interface SteamRecentlyPlayedResponse {
  response: {
    total_count: number;
    games?: SteamRecentlyPlayedGame[];
  };
}

export interface SteamStoreGameDetails {
  success: boolean;
  data: {
    name: string;
    short_description: string;
    developers?: string[];
    publishers?: string[];
    genres?: { id: string; description: string }[];
    header_image: string;
  };
}

export type SteamStoreResponse = Record<string, SteamStoreGameDetails>;
