import { Request } from 'express';

export interface SteamUser {
  steamId: string;
  username: string;
  photos: { value: string }[];
}

export interface UserProfile {
  id: string;
  username: string | null;
  steamId: string | null;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthenticatedRequest extends Request {
  isAuthenticated(): this is AuthenticatedRequest;
  user: UserProfile;
}
