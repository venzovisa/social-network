import { ApiProperty } from '@nestjs/swagger';
import { SimpleUserDTO } from './simple-user-dto';

export class SimpleUserReactionDTO extends SimpleUserDTO {
  @ApiProperty()
  reaction: number;
}
