import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    // one way using Repository methods
    return this.repo.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    // one way using Repository methods
    return this.repo.findOne({ where: { username } });
  }

  async findAllUser(page = 1, limit = 10) {
    const [data, total] = await this.repo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async save(user: Partial<User>): Promise<User> {
    return this.repo.save(user);
  }

  async findByUserId(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async update(
    user: Partial<User>,
  ): Promise<{ username: string; email: string }> {
    const updatedUser = await this.repo.save(user);
    return {
      username: updatedUser.username,
      email: updatedUser.email,
    };
  }
}
