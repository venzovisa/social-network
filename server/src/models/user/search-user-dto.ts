import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchUserDTO {
  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  email: string;

  @ApiPropertyOptional()
  page: string;

  @ApiPropertyOptional()
  count: string;
}
