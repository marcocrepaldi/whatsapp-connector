import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

interface LoginDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const token = await this.authService.login(loginDto);

    // Define cookie HttpOnly seguro para armazenar o token JWT
    res.cookie('token', token.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS em produção
      sameSite: 'strict',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24, // Expira em 1 dia
    });

    // Retorna também o token no JSON para compatibilidade com frontend
    return { 
      message: 'Login successful',
      access_token: token.access_token,
    };
  }
}
