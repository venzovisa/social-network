import { ApiProperty } from '@nestjs/swagger';

export class ReturnUserDTO {
  @ApiProperty()
  id: number;
  @ApiProperty()
  username: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  role: number;
  @ApiProperty()
  avatar: string;
  @ApiProperty({ type: String })
  banDate: Date;
  @ApiProperty()
  banReason: string;
  @ApiProperty({ type: String })
  lastUpdated: Date;
  @ApiProperty()
  latitude: number;
  @ApiProperty()
  longitude: number;
}
