import { ApiProperty } from '@nestjs/swagger';

export class ReturnSimplePostDTO {
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
  likesCount: number;
}
