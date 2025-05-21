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
import {
  AuthTokenPayload,
  ResponseVM,
  UnauthorizedExceptionVM,
  NotFoundExceptionVM,
  BadRequestExceptionVM,
  ForbiddenExceptionVM,
  HttpExceptionsFilter,
  HttpResponse,
} from "@duongtrungnguyen/micro-commerce";
import { Controller, Get, Post, Body, Put, Param, Delete, UseFilters } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";

import { SellerDetailsResponseVM, SellerResponseVM } from "./vms";
import { CreateSellerDto, UpdateSellerDto } from "./dtos";
import { SellerService } from "./seller.service";

@ApiTags("Seller")
@Controller()
@UseFilters(new HttpExceptionsFilter())
export class SellerController {
  constructor(
    private readonly sellerService: SellerService,
    private readonly i18nService: I18nService,
  ) {}

  @Post()
  @ApiOperation({ summary: "Create seller" })
  @ApiBearerAuth()
  @ApiBody({ type: CreateSellerDto })
  @ApiCreatedResponse({ type: SellerResponseVM })
  @ApiBadRequestResponse({ description: "Validation failed", type: BadRequestExceptionVM })
  @ApiUnauthorizedResponse({ description: "Missing auth token", type: UnauthorizedExceptionVM })
  async create(@AuthTokenPayload("sub") userId: string, @Body() data: CreateSellerDto): Promise<SellerResponseVM> {
    const created = await this.sellerService.createSellerAndSync(userId, data);

    return HttpResponse.created(this.i18nService.t("seller.create-success"), created);
  }

  @Get("own")
  @ApiOperation({ summary: "Get all user sellers" })
  @ApiBearerAuth()
  @ApiOkResponse({ description: "Get user sellers sucess", type: SellerDetailsResponseVM })
  @ApiUnauthorizedResponse({ description: "Missing auth token", type: UnauthorizedExceptionVM })
  async getSellers(@AuthTokenPayload("sub") userId: string): Promise<SellerDetailsResponseVM> {
    const sellers = await this.sellerService.getSellers(userId);

    return HttpResponse.ok(this.i18nService.t("seller.fetch-success"), sellers);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update seller by ID" })
  @ApiBearerAuth()
  @ApiParam({ name: "id", description: "Seller UUID" })
  @ApiBody({ type: UpdateSellerDto })
  @ApiOkResponse({ type: SellerResponseVM })
  @ApiBadRequestResponse({ description: "Validation failed", type: BadRequestExceptionVM })
  @ApiUnauthorizedResponse({ description: "Missing auth token", type: UnauthorizedExceptionVM })
  @ApiForbiddenResponse({ description: "Forbidden to update", type: ForbiddenExceptionVM })
  @ApiNotFoundResponse({ description: "Seller not found", type: NotFoundExceptionVM })
  async update(@AuthTokenPayload("sub") userId: string, @Param("id") id: string, @Body() data: UpdateSellerDto): Promise<SellerResponseVM> {
    const updated = await this.sellerService.authUpdate(userId, id, data);

    return HttpResponse.ok(this.i18nService.t("seller.update-success"), updated);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete seller" })
  @ApiBearerAuth()
  @ApiParam({ name: "id", description: "Seller UUID" })
  @ApiOkResponse({ type: ResponseVM })
  @ApiUnauthorizedResponse({ description: "Missing auth token", type: UnauthorizedExceptionVM })
  @ApiForbiddenResponse({ description: "Forbidden to delete", type: ForbiddenExceptionVM })
  @ApiNotFoundResponse({ description: "Seller not found", type: NotFoundExceptionVM })
  async delete(@AuthTokenPayload("sub") userId: string, @Param("id") id: string): Promise<ResponseVM> {
    await this.sellerService.deleteOrThrow({ userId, id }, this.i18nService.t("seller.not-found"));

    return HttpResponse.ok(this.i18nService.t("seller.delete-success"));
  }
}
