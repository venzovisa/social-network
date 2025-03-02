import { JwtAuthGuard } from './jwt.guard';
import { ReturnMessageDTO } from './../models/common/return-message-dto';
import { LoginUserDTO } from './../models/user/login-user-dto';
import { AuthService } from './auth.service';
import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ReturnTokenDTO } from 'src/models/auth/return-token-dto';
import { Request } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  
  @ApiResponse({ type: ReturnTokenDTO})
  @Post('login')
  async login(@Body(new ValidationPipe({ whitelist: true, transform: true })) body: LoginUserDTO) {
    const token = await this.authService.login(body);

    return { token };
  }

  @ApiResponse({ type: ReturnMessageDTO })
  @ApiBearerAuth()
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() request: Request) {
    const token = request.headers.authorization.replace('Bearer ', '');

    await this.authService.logout(token);

    return { message: 'You have been logged out!' };
  }
}
