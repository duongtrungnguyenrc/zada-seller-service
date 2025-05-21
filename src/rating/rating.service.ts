import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PagingDto, PagingDataVM } from "@duongtrungnguyen/micro-commerce";
import { FindOptionsWhere, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { I18nService } from "nestjs-i18n";

import { GetUsersRequest, UserClientService, UsersResponse } from "~user-client";
import { SellerService } from "~seller";

import { CreateRatingDto, UpdateRatingDto } from "./dtos";
import { RatingDetailVM, RatingVM } from "./vms";
import { RatingEntity } from "./entities";

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(RatingEntity)
    private readonly ratingRepository: Repository<RatingEntity>,
    private readonly userClientService: UserClientService,
    private readonly i18nService: I18nService,
    private readonly sellerService: SellerService,
  ) {}

  async create(userId: string, sellerId: string, data: CreateRatingDto): Promise<RatingVM> {
    const seller = await this.sellerService.get({ id: sellerId });
    if (!seller) {
      throw new BadRequestException(this.i18nService.t("seller.not-found"));
    }

    const rating = this.ratingRepository.create({
      userId,
      seller: { id: sellerId },
      ...data,
    });

    return this.ratingRepository.save(rating);
  }

  async getRatingDetails(filter: FindOptionsWhere<RatingEntity>, pageable: PagingDto): Promise<PagingDataVM<RatingDetailVM>> {
    const [ratings, ratingCount] = await Promise.all([
      this.ratingRepository
        .createQueryBuilder("ratings")
        .leftJoinAndSelect("ratings.seller", "seller")
        .select(["ratings.id", "ratings.userId", "ratings.stars", "ratings.content", "ratings.createdAt", "seller.id", "seller.name", "seller.logoUrl"])
        .where(filter ?? {})
        .skip((pageable.page - 1) * pageable.size)
        .take(pageable.size)
        .getMany(),
      this.ratingRepository.count({ where: filter }),
    ]);

    if (ratings.length === 0) {
      return { data: [], meta: this._buildPagingMeta(0, pageable) };
    }

    const userIds = ratings.map((r) => r.userId);
    const { data: users } = await this.userClientService.call<GetUsersRequest, UsersResponse>("getUsers", {
      filter: { ids: userIds },
      select: ["id", "fullName", "avatarUrl"],
    });

    const userMap = new Map(users.map((u) => [u.id, u]));

    const result = ratings.map((rating) => ({
      ...rating,
      user: userMap.get(rating.userId),
    })) as RatingDetailVM[];

    return {
      data: result,
      meta: this._buildPagingMeta(ratingCount, pageable),
    };
  }

  async update(userId: string, id: string, data: UpdateRatingDto): Promise<RatingEntity> {
    const rating = await this.ratingRepository.findOneBy({ id });

    if (!rating) {
      throw new NotFoundException(this.i18nService.t("rating.not-found"));
    }
    if (rating.userId !== userId) {
      throw new ForbiddenException(this.i18nService.t("seller.forbidden-access"));
    }

    Object.assign(rating, data);
    return this.ratingRepository.save(rating);
  }

  async remove(userId: string, id: string): Promise<void> {
    const rating = await this.ratingRepository.findOne({
      where: { id, userId },
      select: ["id", "userId"],
    });

    if (!rating) {
      throw new NotFoundException(this.i18nService.t("rating.not-found"));
    }

    await this.ratingRepository.remove(rating);
  }

  private _buildPagingMeta(totalItems: number, pageable: PagingDto) {
    const totalPages = Math.ceil(totalItems / pageable.size);
    return { ...pageable, totalPages };
  }
}
