import { ApiProperty } from '@nestjs/swagger';

export class ReturnTokenDTO {
  @ApiProperty()
  token: string;
}
