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
