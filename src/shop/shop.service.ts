import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { I18nService } from "nestjs-i18n";
import { FindOptionsWhere, Repository } from "typeorm";

import { NATS_CLIENT } from "~nats-client";

import { CreateShopDto, UpdateShopDto } from "./dtos";
import { ShopEntity } from "./entities";
import { ShopDetailVM, ShopVM } from "./vms";
import { GetUsersRequest, UserClientService, UsersResponse } from "~user-client";

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(ShopEntity) private readonly shopRepository: Repository<ShopEntity>,
    @Inject(NATS_CLIENT) private readonly natsClient: ClientProxy,
    private readonly userClientService: UserClientService,
    private readonly i18nService: I18nService,
  ) {}

  async create(userId: string, data: CreateShopDto): Promise<ShopVM> {
    const createdShop = this.shopRepository.create({
      userId,
      ...data,
    });

    this.natsClient.emit("user.update", {
      id: userId,
      updates: {
        isSeller: true,
      },
    });

    return await this.shopRepository.save(createdShop);
  }

  async get(filter: FindOptionsWhere<ShopEntity>, select?: (keyof ShopEntity)[]): Promise<ShopVM | null> {
    return await this.shopRepository.findOne({ where: filter, select });
  }

  async getShops(userId?: string): Promise<Array<ShopVM | ShopDetailVM>> {
    const shops = await this.shopRepository.find({ where: userId ? { userId } : {} });

    if (!userId) return shops;
    if (shops.length === 0) return [];

    const uids = shops.map((shop) => shop.userId);
    const { data: users } = await this.userClientService.call<GetUsersRequest, UsersResponse>("getUsers", {
      filter: { ids: uids },
      select: ["id", "fullName", "avatarUrl"],
    });

    return shops.map((shop, index) => {
      return {
        ...shop,
        owner: users[index],
      } as ShopDetailVM;
    });
  }

  async update(filter: FindOptionsWhere<ShopEntity>, updates: UpdateShopDto): Promise<ShopVM> {
    const shop = await this.shopRepository.findOneBy(filter);

    if (!shop) throw new NotFoundException(this.i18nService.t("shop.not-found"));

    return this.shopRepository.save({ ...shop, ...updates });
  }

  async delete(filter: FindOptionsWhere<ShopEntity>): Promise<void> {
    const shop = await this.shopRepository.findOne({ where: filter, select: ["id"] });

    if (!shop) throw new NotFoundException(this.i18nService.t("shop.not-found"));

    await this.shopRepository.delete(shop.id);
  }
}
