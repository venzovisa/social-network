import { JwtAuthGuard } from './../auth/jwt.guard';
import { ReturnPostWithCommentsDTO } from './../models/post/return-post-with-comments-dto';
import { Controller, Get, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReturnSimplePostDTO } from 'src/models/post/return-simple-post-dto';
import { FeedService } from './feed.service';
import { FeedDTO } from 'src/models/post/feed-dto';
import { InjectUser } from 'src/common/decorators/inject-user.decorator';
import { User } from 'src/data/entities/user.entity';
import { ReturnDeltaFeedDTO } from 'src/models/post/return-delta-feed-dto';
import { GetDeltaFeedDTO } from 'src/models/post/get-delta-feed-dto';

@Controller('')
export class FeedController {
  constructor(
    private readonly feedService: FeedService,
  ) { }
  
  @ApiTags('feed')
  @ApiResponse({ type: ReturnSimplePostDTO, isArray: true })
  @Get('feed/popular')
  public async getMostPopular() {
    return this.feedService.getMostPopular();
  }

  @ApiTags('feed')
  @ApiBearerAuth()
  @ApiResponse({ type: ReturnPostWithCommentsDTO, isArray: true })
  @Get('feed')
  @UseGuards(JwtAuthGuard)
  public async getFeed(
    @Query() query: FeedDTO,
    @InjectUser() user: Partial<User>,
  ) {
    return this.feedService.getFeed(user, +query.page, +query.count, +query.distance);
  }

  @ApiTags('feed')
  @ApiBearerAuth()
  @ApiQuery({ type: GetDeltaFeedDTO })
  @ApiResponse({ type: ReturnDeltaFeedDTO })
  @Get('feed/delta')
  @UseGuards(JwtAuthGuard)
  public async getDelta(
    @InjectUser() user: Partial<User>,
    @Query() query: GetDeltaFeedDTO,
  ) {

    let date: Date;
    if (Number.isNaN(+query.createdOrUpdatedAfter)) {
      date = new Date(query.createdOrUpdatedAfter);
    } else {
      date = new Date(+query.createdOrUpdatedAfter);
    }

    if (!query.createdOrUpdatedAfter) {
      throw new BadRequestException('Expected a tracking date, received none!');
    }

    if (query.trackingPosts) {
      const trackingPosts = query.trackingPosts.split(',').map(Number).filter(x => x === x);

      return this.feedService.getDelta(user, date, trackingPosts);
    }

    return this.feedService.getDelta(user, date, [])
  }
}
