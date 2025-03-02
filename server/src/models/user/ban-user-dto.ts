import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString, Length } from 'class-validator';

export class BanUserDTO {
  @ApiProperty()
  @IsString()
  @Length(4, 100)
  reason: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  period: number;
}
