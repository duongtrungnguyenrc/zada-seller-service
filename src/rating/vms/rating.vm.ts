import { ApiProperty } from "@nestjs/swagger";

import { ISeller } from "~seller";

export class RatingVM {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  seller: ISeller;

  @ApiProperty()
  stars: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: Date;
}
