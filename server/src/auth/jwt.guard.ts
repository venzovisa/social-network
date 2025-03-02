import {
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { lastValueFrom, Observable } from 'rxjs';
import { User } from 'src/data/entities/user.entity';
import { TokenService } from 'src/token.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(@Inject(TokenService) private readonly tokenService: TokenService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const token = context.switchToHttp().getRequest<Request>().headers?.authorization?.replace('Bearer ', '');

    if (await this.tokenService.hasToken(token)) {
      return false;
    }

    const result = super.canActivate(context);

    if (result instanceof Observable) {
      return lastValueFrom(result);
    }

    return result;
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    if ((user as Partial<User>).banDate) {
      const date = new Date(user.banDate);

      if (date.valueOf() > Date.now()) {
        throw new UnauthorizedException(`You have been banned until ${date.toLocaleDateString()} ${date.toLocaleTimeString()}, reason: ${user.banReason}.`);
      }
    }

    return user;
  }
}
