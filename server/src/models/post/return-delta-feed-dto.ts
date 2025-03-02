import { ReturnCommentDeltaDTO } from './../comment/return-comment-delta-dto';
import { ApiProperty } from '@nestjs/swagger';
import { ReturnCommentWithLikesDTO } from '../comment/return-comment-with-likes-dto';
import { ReturnPostWithCommentsDTO } from './return-post-with-comments-dto';

export class ReturnDeltaFeedDTO {
  @ApiProperty({ type: ReturnPostWithCommentsDTO, isArray: true })
  posts: ReturnPostWithCommentsDTO[];

  @ApiProperty({ type: ReturnCommentWithLikesDTO, isArray: true })
  comments: ReturnCommentDeltaDTO[];
}
