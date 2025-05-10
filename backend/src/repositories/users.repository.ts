
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
    // return this.repo.findOne({ where: { email } });

    // another way using query builder
    const user = await this.repo
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();

    return user || null;
  }

  async findByUsername(username: string): Promise<User | null> {
    // one way using Repository methods
    // return this.repo.findOne({ where: { username } });

    // another way using query builder
    const user = await this.repo
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .getOne();

    return user || null;
  }

  // async findAll(): Promise<User[]> {
  //   return await this.repo.createQueryBuilder('user').getMany();
  // }

  async findAll(page = 1, limit = 10) {
    const [data, total] = await this.repo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' }, // Optional: sort by ID as createdAt is not available
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async save(user: Partial<User>): Promise<User> {
    // one way using Repository methods
    // return this.repo.save(user);

    // another way using query builder
    const result = await this.repo.manager.query<{
      insertId: number;
      affectedRows: number;
    }>(`INSERT INTO user (username, email, password) VALUES (?, ?, ?)`, [
      user.username,
      user.email,
      user.password,
    ]);

    // Assuming your user table has an auto-generated id column, you can return the result as your user
    if (!user.username || !user.email || !user.password) {
      throw new Error('Username, email and password are required');
    }
    return {
      id: result.insertId,
      username: user.username,
      email: user.email,
      password: user.password,
    };
  }
}
