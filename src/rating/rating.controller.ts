import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import {
  AuthTokenPayload,
  Paging,
  PagingDto,
  ApiPaging,
  ResponseVM,
  NotFoundExceptionVM,
  ForbiddenExceptionVM,
  UnauthorizedExceptionVM,
  BadRequestExceptionVM,
} from "@duongtrungnguyen/micro-commerce";
import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";

import { RatingDetailsResponseVM, RatingResponseVM } from "./vms";
import { CreateRatingDto, UpdateRatingDto } from "./dtos";
import { RatingService } from "./rating.service";

@ApiTags("Ratings")
@Controller("ratings")
export class RatingController {
  constructor(
    private readonly ratingService: RatingService,
    private readonly i18nService: I18nService,
  ) {}

  @Post(":id")
  @ApiOperation({ summary: "Create rating for shop" })
  @ApiBearerAuth()
  @ApiParam({ name: "id", description: "Shop ID" })
  @ApiCreatedResponse({ type: RatingResponseVM })
  @ApiBadRequestResponse({ description: "Validation failed", type: BadRequestExceptionVM })
  @ApiNotFoundResponse({ description: "Shop not found", type: NotFoundExceptionVM })
  @ApiUnauthorizedResponse({ description: "Unauthorized", type: UnauthorizedExceptionVM })
  @ApiForbiddenResponse({ description: "User forbidden to create", type: ForbiddenExceptionVM })
  async create(@AuthTokenPayload("sub") userId: string, @Param("id") shopId: string, @Body() data: CreateRatingDto): Promise<RatingResponseVM> {
    const rating = await this.ratingService.create(userId, shopId, data);

    return {
      message: this.i18nService.t("rating.created-success"),
      data: rating,
    };
  }

  @Get()
  @ApiOperation({ summary: "Get rating details for current user" })
  @ApiPaging()
  @ApiOkResponse({ type: RatingDetailsResponseVM })
  @ApiUnauthorizedResponse({ description: "Unauthorized", type: UnauthorizedExceptionVM })
  @ApiBadRequestResponse({ description: "Invalid paging", type: BadRequestExceptionVM })
  async getRatingDetails(@AuthTokenPayload("sub") userId: string, @Paging() pageable: PagingDto): Promise<RatingDetailsResponseVM> {
    const ratings = await this.ratingService.getRatingDetails(userId ? { userId } : {}, pageable);

    return {
      message: this.i18nService.t("rating.get-details-success"),
      data: ratings,
    };
  }

  @Put(":id")
  @ApiOperation({ summary: "Update rating" })
  @ApiBearerAuth()
  @ApiParam({ name: "id", description: "Rating ID" })
  @ApiOkResponse({ type: RatingResponseVM })
  @ApiBadRequestResponse({ description: "Validation failed", type: BadRequestExceptionVM })
  @ApiNotFoundResponse({ description: "Rating not found", type: NotFoundExceptionVM })
  @ApiForbiddenResponse({ description: "User forbidden to update", type: ForbiddenExceptionVM })
  @ApiUnauthorizedResponse({ description: "Unauthorized", type: UnauthorizedExceptionVM })
  async updateRating(@AuthTokenPayload("sub") userId: string, @Param("id") id: string, @Body() data: UpdateRatingDto): Promise<RatingResponseVM> {
    const updatedRating = await this.ratingService.update(userId, id, data);

    return {
      message: this.i18nService.t("rating.update-success"),
      data: updatedRating,
    };
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete rating" })
  @ApiBearerAuth()
  @ApiParam({ name: "id", description: "Rating ID" })
  @ApiOkResponse({ type: ResponseVM })
  @ApiUnauthorizedResponse({ description: "Unauthorized", type: UnauthorizedExceptionVM })
  @ApiNotFoundResponse({ description: "Rating not found", type: NotFoundExceptionVM })
  @ApiForbiddenResponse({ description: "User forbidden to delete", type: ForbiddenExceptionVM })
  async delete(@AuthTokenPayload("sub") userId: string, @Param("id") id: string): Promise<ResponseVM> {
    await this.ratingService.remove(userId, id);

    return {
      message: this.i18nService.t("rating.delete-success"),
    };
  }
}
