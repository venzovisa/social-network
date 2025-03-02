import { SimpleUserReactionDTO } from './../user/simple-user-reaction-dto';
import { SimpleUserDTO } from './../user/simple-user-dto';
import { ApiProperty } from '@nestjs/swagger';

export class ReturnCommentWithLikesDTO {
  @ApiProperty()
  id: number;
  @ApiProperty()
  content: string;
  @ApiProperty()
  picture: string;
  @ApiProperty()
  embed: string;
  @ApiProperty()
  createdOn: string;
  @ApiProperty()
  updatedOn: string;
  @ApiProperty({ type: SimpleUserDTO })
  author: SimpleUserDTO;
  @ApiProperty({ type: SimpleUserReactionDTO, isArray: true })
  likes: SimpleUserReactionDTO[];
}
