import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.repo.findOne({ where: { username } });
  }

  async findAllUser(
    page?: number,
    limit?: number,
    name?: string,
    email?: string,
  ) {
    const transformUsers = (users: any[]) =>
      users.map(({ password, ...rest }) => rest);

    const whereCondition: any = { isDeleted: false };
    if (name) {
      whereCondition.username = ILike(`%${name}%`);
    }

    if (email) {
      whereCondition.email = ILike(`%${email}%`);
    }

    if (page && limit) {
      const [data, total] = await this.repo.findAndCount({
        where: whereCondition,
        skip: (page - 1) * limit,
        take: limit,
        order: { id: 'DESC' },
      });

      return {
        data: transformUsers(data),
        total,
        page,
        lastPage: Math.ceil(total / limit),
      };
    }

    const data = await this.repo.find({
      where: whereCondition,
      order: { id: 'DESC' },
    });
    return {
      data: transformUsers(data),
      total: data.length,
      page: 1,
      lastPage: 1,
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

  async toggleUserActiveStatus(user: Partial<User>): Promise<User> {
    return this.repo.save(user);
  }

  async softDeleteUser(user: Partial<User>): Promise<User> {
    return this.repo.save(user);
  }

  async findAllUserTable({
    page = 1,
    limit = 10,
    search = '',
    filters = [],
    sort = [],
  }: {
    page: number;
    limit: number;
    search?: string;
    filters?: { id: string; value: string }[];
    sort?: { id: string; desc: boolean }[];
  }) {

    const where: any = { isDeleted: false };

    // Global search
    if (search) {
      where.username = ILike(`%${search}%`);
    }

    // Column filters
    filters.forEach((filter) => {
      if (filter.id === 'username') {
        where.username = ILike(`%${filter.value}%`);
      }
      if (filter.id === 'email') {
        where.email = ILike(`%${filter.value}%`);
      }
      if (filter.id === 'isActiveUser') {
        where.isActiveUser = filter.value;
      }
    });

    // Sorting
    const order: Record<string, 'ASC' | 'DESC'> = {};
    sort.forEach((sortObj) => {
      order[sortObj.id] = sortObj.desc ? 'DESC' : 'ASC';
    });

    const [data, total] = await this.repo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: Object.keys(order).length ? order : { id: 'DESC' },
    });

    return {
      data: data.map(({ password, ...rest }) => rest),
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }
}
