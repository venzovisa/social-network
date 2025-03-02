import { ApiProperty } from '@nestjs/swagger';

export class ReturnMessageDTO {
  @ApiProperty()
  message: string;
}
