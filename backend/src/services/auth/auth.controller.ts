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
  Patch,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto, UpdateUserDto } from '../../dtos/login.dto';

// JWT token
import { JwtAuthGuard } from '../../jwt/jwt-auth.guard';
import { Express, Response } from 'express';
import { UploadFileInterceptor } from '../../utils/file-upload.util';
import { PdfService } from '../pdf/pdf.service';
import { Workbook } from 'exceljs';

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
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('name') name?: string,
    @Query('email') email?: string,
  ): Promise<any> {
    return this.authService.findAllUser(
      Number(page),
      Number(limit),
      name,
      email,
    );
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
  @Patch('user/:id/soft-delete')
  async softDeleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.authService.softDeleteUser(Number(id));
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
      const result = await this.authService.findAllUser();
      users = result.data;
    }

    if (!users || users.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: 'No users found',
      });
    }

    // Transform user data
    const transformedUsers = users.map((user) => ({
      ID: user.id,
      Username: user.username,
      Email: user.email,
      Image: user.image || 'N/A',
      Active: user.isActiveUser ? 'Yes' : 'No',
    }));

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Users');

    // Add header row
    const headers = Object.keys(transformedUsers[0]);
    worksheet.addRow(headers);

    // Add user data
    transformedUsers.forEach((user) => {
      worksheet.addRow(Object.values(user));
    });

    // Apply styling to header
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' }, // Yellow background
      };
      cell.alignment = { horizontal: 'center' };
    });

    // Set the response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename="users.xlsx"');

    // Write file to buffer and send
    const buffer = await workbook.xlsx.writeBuffer();
    res.send(buffer);
  }

  @UseGuards(JwtAuthGuard)
  @Post('users/table-data')
  async findAllUserTable(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('filters') filters?: string,
    @Query('sort') sort?: string,
  ): Promise<any> {
    try {
      const parsedPage = Number(page);
      const parsedLimit = Number(limit);

      // Fallback defaults if parsing fails
      const safePage = isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;
      const safeLimit =
        isNaN(parsedLimit) || parsedLimit < 1 ? 10 : parsedLimit;
      return await this.authService.findAllUserTable({
        page: safePage,
        limit: safeLimit,
        search,
        filters: filters ? JSON.parse(filters) : [],
        sort: sort ? JSON.parse(sort) : [],
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to fetch users table data',
          details: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
