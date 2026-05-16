import {
  IsNumber,
  IsString,
  IsOptional,
  Min,
  Max,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    description: 'The internal ID of the game',
    example: 'cmovawxue0000v4140j8h8v9j',
  })
  @IsString()
  gameId!: string;

  @ApiProperty({
    description: 'Rating from 1 to 5 stars',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number;

  @ApiPropertyOptional({
    description: 'Review content/comment',
    example: 'This game is absolutely amazing!',
    minLength: 3,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  content?: string;
}
