import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './services/auth/auth.module';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbPort = config.get<string>('DB_PORT');
        if (!dbPort) {
          throw new Error('DB_PORT is not defined in environment variables');
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
      },
    }),

    AuthModule,
  ],
})
export class AppModule {}
