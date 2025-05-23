import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../../repositories/users.repository';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException({ message: 'Incorrect username or password' });
    }

    if (!user.isActiveUser) {
      throw new UnauthorizedException({
        message:
          'Your account is deactivated. Please contact support Team for more details.',
      });
    }

    if (user.isDeleted) {
      throw new UnauthorizedException({
        message:
          'Your account is deleted. Please contact support Team for more details.',
      });
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findByUsername(username);
  }

  async createUser(
    username: string,
    email: string,
    password: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user: Partial<User> = {
      username,
      email,
      password: hashedPassword,
    };
    return this.usersRepository.save(user);
  }

  async findAllUser(page?: number, limit?: number, name?: string, email?: string) {
    return this.usersRepository.findAllUser(page, limit, name, email);
  }

  async toggleUserActiveStatus(id: number) {
    const user = await this.usersRepository.findByUserId(id);

    if (!user) {
      throw new Error('User not found');
    }
    user.isActiveUser = !user.isActiveUser;
    return this.usersRepository.toggleUserActiveStatus(user);
  }

  async findByUserId(id: number) {
    return this.usersRepository.findByUserId(id);
  }

  async softDeleteUser(id: number) {
    const user = await this.usersRepository.findByUserId(id);
    if (!user) {
      throw new Error('User not found');
    }
    user.isDeleted = true;
    await this.usersRepository.softDeleteUser(user);
    return { message: 'User soft deleted successfully' };
  }

  async updateUser(
    id: number,
    updateData: { username?: string; email?: string; image?: string },
  ) {
    const user = await this.usersRepository.findByUserId(id);

    if (!user) {
      throw new Error('User not found');
    }

    // 🧹 Delete old image if new image is uploaded
    if (updateData.image && user.image) {
      const oldImagePath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'uploads',
        'users',
        path.basename(user.image),
      );

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    user.username = updateData.username ?? user.username;
    user.email = updateData.email ?? user.email;
    user.image = updateData.image ?? user.image;

    return this.usersRepository.update(user);
  }
}
