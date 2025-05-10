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
  UploadedFile,
  Res,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto, UpdateUserDto } from '../../dtos/login.dto';

// JWT token
import { JwtAuthGuard } from '../../jwt/jwt-auth.guard';
import { Express, Response } from 'express';
import { UploadFileInterceptor } from '../../utils/file-upload.util';
import { PdfService } from '../pdf/pdf.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly pdfService: PdfService,
    private readonly authService: AuthService,
  ) {}

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

  @UseGuards(JwtAuthGuard)
  @Post('users/download-pdf')
  async downloadPdf(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Res() res: Response,
  ) {
    const result = await this.authService.findAllUser(page, limit);
    const users = result.data;

    if (users.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: 'User not found',
      });
    }

    const pdfBuffer = await this.pdfService.generatePdf(users);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="user-profile.pdf"',
    });

    res.send(pdfBuffer);
  }
}
