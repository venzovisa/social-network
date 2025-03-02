import { ReturnCommentWithLikesDTO } from './../comment/return-comment-with-likes-dto';
import { SimpleUserReactionDTO } from '../user/simple-user-reaction-dto';
import { SimpleUserDTO } from './../user/simple-user-dto';
import { ApiProperty } from '@nestjs/swagger';

export class ReturnPostWithCommentsDTO {
  @ApiProperty()
  id: number;
  @ApiProperty()
  content: string;
  @ApiProperty()
  picture: string;
  @ApiProperty()
  embed: string;
  @ApiProperty()
  latitude: number;
  @ApiProperty()
  longitude: number;
  @ApiProperty()
  createdOn: string;
  @ApiProperty()
  updatedOn: string;
  @ApiProperty()
  isPublic: boolean;
  @ApiProperty({ type: SimpleUserDTO })
  author: SimpleUserDTO;
  @ApiProperty({ type: SimpleUserReactionDTO, isArray: true })
  likes: SimpleUserReactionDTO[];
  @ApiProperty({ type: ReturnCommentWithLikesDTO, isArray: true })
  comments: ReturnCommentWithLikesDTO[];
}
