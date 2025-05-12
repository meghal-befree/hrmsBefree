import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: '' })
  image?: string;

  @Column({ default: false })
  isAdmin?: boolean;

  @Column({ default: true })
  isActiveUser: boolean;
}
