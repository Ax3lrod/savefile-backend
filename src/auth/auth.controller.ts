import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import type {
  AuthenticatedRequest,
  SteamUser,
} from '../common/types/auth.types';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('steam')
  @UseGuards(AuthGuard('steam'))
  @ApiOperation({
    summary: 'Initiate Steam Login',
    description: 'Redirects the user to the Steam OpenID authentication page.',
  })
  @ApiResponse({ status: 302, description: 'Redirect to Steam.' })
  async steamLogin() {
    // This route will redirect the user to Steam for authentication
  }

  @Get('steam/return')
  @UseGuards(AuthGuard('steam'))
  @ApiOperation({
    summary: 'Steam Auth Callback',
    description:
      'Handles the return from Steam and establishes the user session.',
  })
  @ApiResponse({
    status: 200,
    description: 'Authentication successful. User session established.',
  })
  @ApiResponse({ status: 401, description: 'Steam authentication failed.' })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during session creation.',
  })
  async steamCallback(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    try {
      if (!req.user) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          status: 'error',
          message: 'Steam authentication failed',
        });
      }

      // At this point req.user is still the raw SteamUser from the strategy
      const steamData = req.user as unknown as SteamUser;
      const user = await this.authService.validateSteamUser(steamData);

      // Manually log the user in to ensure session is saved as UserProfile
      req.login(user, (err) => {
        if (err) {
          console.error('Passport login error:', err);
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Failed to establish session',
          });
        }
        return res.status(HttpStatus.OK).json({
          status: 'success',
          message: 'Authentication successful',
          data: user,
        });
      });
    } catch (error) {
      console.error('Steam Auth Error:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Internal server error during authentication',
      });
    }
  }
}
