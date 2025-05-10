import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Put,
  ValidationPipe,
  UsePipes,
  UploadedFile
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {LoginDto, SignupDto, UpdateUserDto} from '../../dtos/login.dto';

// JWT token
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../jwt/jwt-auth.guard';
import { Express } from 'express'
import {UploadFileInterceptor} from "../../utils/file-upload.util";

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

  @UseGuards(JwtAuthGuard)
  @Put('users/:id')
  @UploadFileInterceptor('image', 'users')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateUser(
      @Param('id') id: string,
      @Body() updateData: UpdateUserDto,
      @UploadedFile() image: Express.Multer.File,
  ) {
    if (image) {
      updateData.image = `/uploads/users/${image.filename}`;
    }

    const result = await this.authService.updateUser(Number(id), updateData);

    return {
      statusCode: 200,
      message: ['User updated successfully'],
      data: result,
    };
  }
}
