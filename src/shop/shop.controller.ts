import {
  ApiTags,
  ApiOperation,
  ApiBadRequestResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
} from "@nestjs/swagger";
import { AuthTokenPayload, ResponseVM, UnauthorizedExceptionVM, NotFoundExceptionVM, BadRequestExceptionVM, ForbiddenExceptionVM } from "@duongtrungnguyen/micro-commerce";
import { Controller, Get, Post, Body, Put, Param, Delete } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";

import { ShopDetailsResponseVM, ShopResponseVM } from "./vms";
import { CreateShopDto, UpdateShopDto } from "./dtos";
import { ShopService } from "./shop.service";

@ApiTags("Shops")
@Controller()
export class ShopController {
  constructor(
    private readonly shopService: ShopService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiOperation({ summary: "Create shop" })
  @ApiBearerAuth()
  @ApiBody({ type: CreateShopDto })
  @ApiCreatedResponse({ type: ShopResponseVM })
  @ApiBadRequestResponse({ description: "Validation failed", type: BadRequestExceptionVM })
  @ApiUnauthorizedResponse({ description: "Unauthorized", type: UnauthorizedExceptionVM })
  async create(@AuthTokenPayload("sub") userId: string, @Body() data: CreateShopDto): Promise<ShopResponseVM> {
    const created = await this.shopService.create(userId, data);

    return {
      message: this.i18n.t("shop.create-success"),
      data: created,
    };
  }

  @Get()
  @ApiOperation({ summary: "Get all shops of seller" })
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ShopDetailsResponseVM,
  })
  async getShops(@AuthTokenPayload("sub") userId: string): Promise<ShopDetailsResponseVM> {
    const shops = await this.shopService.getShops(userId);

    return {
      message: this.i18n.t("shop.fetch-success"),
      data: shops,
    };
  }

  @Put(":id")
  @ApiOperation({ summary: "Update shop by ID" })
  @ApiBearerAuth()
  @ApiParam({ name: "id", description: "Shop UUID" })
  @ApiBody({ type: UpdateShopDto })
  @ApiOkResponse({ type: ShopResponseVM })
  @ApiBadRequestResponse({ description: "Validation failed", type: BadRequestExceptionVM })
  @ApiUnauthorizedResponse({ description: "Unauthorized", type: UnauthorizedExceptionVM })
  @ApiForbiddenResponse({ description: "Forbidden to update", type: ForbiddenExceptionVM })
  @ApiNotFoundResponse({ description: "Shop not found", type: NotFoundExceptionVM })
  async update(@AuthTokenPayload("sub") userId: string, @Param("id") id: string, @Body() dto: UpdateShopDto): Promise<ShopResponseVM> {
    const updated = await this.shopService.update({ id, userId }, dto);

    return {
      message: this.i18n.t("shop.update-success"),
      data: updated,
    };
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete shop" })
  @ApiBearerAuth()
  @ApiParam({ name: "id", description: "Shop UUID" })
  @ApiOkResponse({ type: ResponseVM })
  @ApiUnauthorizedResponse({ description: "Unauthorized", type: UnauthorizedExceptionVM })
  @ApiForbiddenResponse({ description: "Forbidden to delete", type: ForbiddenExceptionVM })
  @ApiNotFoundResponse({ description: "Shop not found", type: NotFoundExceptionVM })
  async delete(@AuthTokenPayload("sub") userId: string, @Param("id") id: string): Promise<ResponseVM> {
    await this.shopService.delete({ userId, id });

    return {
      message: this.i18n.t("shop.delete-success"),
    };
  }
}
