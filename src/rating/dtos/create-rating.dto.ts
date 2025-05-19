import { IsInt, IsString, Min, Max } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateRatingDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(5)
  stars: number;

  @ApiProperty()
  @IsString()
  content: string;
}
