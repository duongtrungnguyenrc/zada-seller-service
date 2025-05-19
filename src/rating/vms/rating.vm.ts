import { ApiProperty } from "@nestjs/swagger";

import { IShop } from "~shop";

export class RatingVM {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  shop: IShop;

  @ApiProperty()
  stars: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: Date;
}
