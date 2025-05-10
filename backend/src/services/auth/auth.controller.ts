import {Controller, Post, Body, Get, Query, Param} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from '../../dtos/login.dto';

// JWT token
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../jwt/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    const { username, email, password } = signupDto;
    return this.authService.createUser(username, email, password);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    return this.authService.login(email, password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<any> {
    return this.authService.findAllUser(Number(page), Number(limit));
  }

  @UseGuards(JwtAuthGuard)
  @Get('users/:id')
  async findOne(@Param('id') id: string) {
    return this.authService.findByUserId(Number(id));
  }
}
