import { ConnectionStatus } from './../../common/enums/connection-status.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SimpleUserDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  avatar: string;

  @ApiPropertyOptional({ type: Number })
  friendshipStatus?: ConnectionStatus;

  @ApiPropertyOptional()
  canAcceptFriendship?: boolean;
}
