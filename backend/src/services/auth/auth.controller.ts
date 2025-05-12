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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto, UpdateUserDto } from '../../dtos/login.dto';

// JWT token
import { JwtAuthGuard } from '../../jwt/jwt-auth.guard';
import { Express, Response } from 'express';
import { UploadFileInterceptor } from '../../utils/file-upload.util';
import { PdfService } from '../pdf/pdf.service';
import * as XLSX from 'xlsx';

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
  @Put('user/:id/toggle-active')
  async toggleActive(@Param('id') id: string) {
    return this.authService.toggleUserActiveStatus(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post('users/download-pdf')
  async downloadPdf(
    @Res() res: Response,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    let users;

    if (page && limit) {
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);

      if (isNaN(pageNum) || isNaN(limitNum)) {
        return res.status(400).json({ message: 'Invalid page or limit' });
      }

      const result = await this.authService.findAllUser(pageNum, limitNum);
      users = result.data;
    } else {
      // Fetch all users (no pagination)
      const result = await this.authService.findAllUser(); // default to all
      users = result.data;
    }

    if (!users || users.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: 'User not found',
      });
    }

    const pdfBuffer = await this.pdfService.generatePdf(users);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="user-list.pdf"',
    });

    res.send(pdfBuffer);
  }

  @UseGuards(JwtAuthGuard)
  @Post('users/csv-download')
  async downloadCsv(
    @Res() res: Response,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    let users;

    if (page && limit) {
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);

      if (isNaN(pageNum) || isNaN(limitNum)) {
        return res.status(400).json({ message: 'Invalid page or limit' });
      }

      const result = await this.authService.findAllUser(pageNum, limitNum);
      users = result.data;
    } else {
      const result = await this.authService.findAllUser(); // Fetch all users
      users = result.data;
    }

    if (!users || users.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: 'No users found',
      });
    }

    // Create the XLSX worksheet
    const ws = XLSX.utils.json_to_sheet(users);

    // Create a workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');

    // Generate the Excel file as a buffer
    const fileBuffer: Buffer = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'buffer',
    });

    // Set the response headers for file download
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="users.xlsx"',
    });

    // Send the file as a response
    res.send(fileBuffer);
  }
}
