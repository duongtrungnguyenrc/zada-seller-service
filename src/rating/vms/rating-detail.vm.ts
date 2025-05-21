import { ApiProperty, OmitType } from "@nestjs/swagger";

import { UserVM } from "~user-client";
import { ISeller } from "~seller";

import { RatingVM } from "./rating.vm";

export class RatingDetailVM extends OmitType(RatingVM, ["userId"] as const) {
  @ApiProperty()
  id: string;

  @ApiProperty({
    type: Object,
    example: {
      id: "",
      fullName: "",
      avatarUrl: "",
    },
  })
  user: UserVM;

  @ApiProperty({
    type: Object,
    example: {
      id: "",
      name: "",
      logoUrl: "",
    },
  })
  seller: ISeller;

  @ApiProperty()
  stars: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: Date;
}
