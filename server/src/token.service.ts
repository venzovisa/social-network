import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from './data/entities/token.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token) private readonly tokenRepository: Repository<Token>,
  ) { }
  
  async hasToken(token) {
    const record = await this.tokenRepository.findOne({ token });

    return !!record;
  }
}
