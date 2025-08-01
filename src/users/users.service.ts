import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async create(name: string, email: string, password: string, role: string = 'user'): Promise<User> {
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
    );

    const user = this.usersRepository.create({
      name,
      email,
      passwordHash: hashedPassword, // ajusta para password_hash do banco
      role,
    });

    return await this.usersRepository.save(user);
  }
}
