import { LoginUserDTO } from './../models/user/login-user-dto';
import { User } from './../data/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Token } from 'src/data/entities/token.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Token) private readonly tokenRepository: Repository<Token>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {

    const user = await this.userRepository.findOne({ username });

    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        const { password, isDeleted, ...result } = user;

        return result;
      }
    }

    return null;
  }

  async login({ username, password }: LoginUserDTO) {
    const user = await this.validateUser(username, password);

    if (!user) throw new UnauthorizedException();

    return this.jwtService.sign({
      id: user.id,
      username: username,
      email: user.email,
      role: user.role,
    });
  }

  async logout(token: string) {
    return this.tokenRepository.save(this.tokenRepository.create({ token }));
  }
}
