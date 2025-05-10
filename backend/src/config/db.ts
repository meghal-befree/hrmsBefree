import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';

export const typeOrmConfig = (config: ConfigService): TypeOrmModuleOptions => {
    const dbPort = config.get<string>('DB_PORT');
    if (!dbPort) {
        throw new Error('DB_PORT is not defined');
    }

    return {
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: parseInt(dbPort, 10),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [User],
        synchronize: true,
    };
};
