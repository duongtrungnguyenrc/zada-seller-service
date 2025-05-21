import { ApiProperty } from "@nestjs/swagger";

export class SellerVM {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

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
