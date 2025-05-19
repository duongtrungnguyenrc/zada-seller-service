import { ApiProperty } from "@nestjs/swagger";

export class UpdateRatingDto {
  @ApiProperty()
  stars: number;

  @ApiProperty()
  content: string;
}
