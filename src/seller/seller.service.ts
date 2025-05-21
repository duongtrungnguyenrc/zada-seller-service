import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { I18nService } from "nestjs-i18n";
import { FindOptionsWhere, Repository } from "typeorm";

import { NATS_CLIENT } from "~nats-client";
import { GetUsersRequest, UserClientService, UsersResponse } from "~user-client";

import { CreateSellerDto, UpdateSellerDto } from "./dtos";
import { SellerDetailVM, SellerVM } from "./vms";
import { SellerEntity } from "./entities";

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(SellerEntity) private readonly sellerRepository: Repository<SellerEntity>,
    @Inject(NATS_CLIENT) private readonly natsClient: ClientProxy,
    private readonly userClientService: UserClientService,
    private readonly i18nService: I18nService,
  ) {}

  async create(userId: string, data: CreateSellerDto): Promise<SellerVM> {
    const createdSeller = this.sellerRepository.create({
      userId,
      ...data,
    });

    this.natsClient.emit("user.update", {
      id: userId,
      updates: {
        isSeller: true,
      },
    });

    return await this.sellerRepository.save(createdSeller);
  }

  async get(filter: FindOptionsWhere<SellerEntity>, select?: (keyof SellerEntity)[]): Promise<SellerVM | null> {
    return await this.sellerRepository.findOne({ where: filter, select });
  }

  async getSellers(userId?: string): Promise<Array<SellerVM | SellerDetailVM>> {
    const sellers = await this.sellerRepository.find({ where: userId ? { userId } : {} });

    if (!userId) return sellers;
    if (sellers.length === 0) return [];

    const uids = sellers.map((seller) => seller.userId);
    const { data: users } = await this.userClientService.call<GetUsersRequest, UsersResponse>("getUsers", {
      filter: { ids: uids },
      select: ["id", "fullName", "avatarUrl"],
    });

    return sellers.map((seller, index) => {
      return {
        ...seller,
        owner: users[index],
      } as SellerDetailVM;
    });
  }

  async update(filter: FindOptionsWhere<SellerEntity>, updates: UpdateSellerDto): Promise<SellerVM> {
    const seller = await this.sellerRepository.findOneBy(filter);

    if (!seller) throw new NotFoundException(this.i18nService.t("seller.not-found"));

    return this.sellerRepository.save({ ...seller, ...updates });
  }

  async delete(filter: FindOptionsWhere<SellerEntity>): Promise<void> {
    const seller = await this.sellerRepository.findOne({ where: filter, select: ["id"] });

    if (!seller) throw new NotFoundException(this.i18nService.t("seller.not-found"));

    await this.sellerRepository.delete(seller.id);
  }
}
