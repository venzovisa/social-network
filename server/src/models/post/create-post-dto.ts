import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import * as sanitize from 'sanitize-html';
import { sanitizerSettings } from 'src/common/sanitizer/sanitizer-settings';

export class CreatePostDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Transform((t) => t.value && sanitize(t.value, sanitizerSettings))
  embed?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  latitude?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  longitude?: string;

  @ApiProperty()
  @IsString()
  isPublic?: string;
}
