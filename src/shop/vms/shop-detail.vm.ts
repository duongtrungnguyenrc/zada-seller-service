import { ApiProperty } from "@nestjs/swagger";

import { UserVM } from "~user-client";

export class ShopDetailVM {
  @ApiProperty()
  id: string;

  @ApiProperty()
  owner: UserVM;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  logoUrl?: string;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  taxId?: string;

  @ApiProperty()
  isVerified: boolean;

  @ApiProperty()
  isLocked: boolean;

  @ApiProperty()
  createdAt: Date;
}
