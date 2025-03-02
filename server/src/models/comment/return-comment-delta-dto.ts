import { ApiProperty } from '@nestjs/swagger';
import { ReturnCommentWithLikesDTO } from './return-comment-with-likes-dto';

export class ReturnCommentDeltaDTO extends ReturnCommentWithLikesDTO {
  @ApiProperty()
  postId: number;
}
