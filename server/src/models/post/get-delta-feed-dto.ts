import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetDeltaFeedDTO {
  @ApiProperty()
  createdOrUpdatedAfter: string;

  @ApiPropertyOptional()
  trackingPosts: string;
}