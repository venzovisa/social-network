import { ApiProperty } from '@nestjs/swagger';
import { SimpleUserDTO } from './../user/simple-user-dto';

export class ReturnPostDTO {
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
  @ApiProperty()
  author: SimpleUserDTO;
}
