import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ReactionType } from 'src/common/enums/reaction-type.enum';

export class LikeDTO {
  @ApiProperty({ type: Number })
  @IsEnum(ReactionType)
  reaction: ReactionType;
}
