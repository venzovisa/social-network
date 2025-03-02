import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import * as sanitize from 'sanitize-html';
import { sanitizerSettings } from 'src/common/sanitizer/sanitizer-settings';

export class CreateCommentDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Transform((t) => t.value && sanitize(t.value, sanitizerSettings))
  embed?: string;
}