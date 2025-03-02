import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class LoginUserDTO {
  @ApiProperty()
  @IsString()
  @Length(4, 40)
  username: string;

  @ApiProperty()
  @IsString()
  @Length(6, 40)
  password: string;
}
