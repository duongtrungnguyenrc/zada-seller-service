import { IsBoolean, IsString, IsUrl } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateShopDto {
  @ApiProperty()
  @IsString({ message: "validation.invalid-shop-name" })
  name: string;

  @ApiProperty()
  @IsString({ message: "validation.invalid-description" })
  description: string;

  @ApiProperty()
  @IsUrl({}, { message: "validation.invalid-logo-url" })
  logoUrl: string;

  @ApiProperty()
  @IsString({ message: "validation.invalid-tax-id" })
  taxId: string;

  @ApiProperty()
  @IsBoolean({ message: "validation.invalid-verification" })
  isVerified: boolean;
}
