import { IsBoolean, IsOptional, IsString, IsUrl } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateShopDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: "validation.invalid-shop-name" })
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: "validation.invalid-description" })
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl({}, { message: "validation.invalid-logo-url" })
  logoUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: "validation.invalid-tax-id" })
  taxId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean({ message: "validation.invalid-verification" })
  isVerified?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean({ message: "validation.invalid-locked" })
  isLocked?: boolean;
}
