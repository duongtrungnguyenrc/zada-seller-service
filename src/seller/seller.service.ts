import { RepositoryService } from "@duongtrungnguyen/micro-commerce";
import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { I18nService } from "nestjs-i18n";
import { Repository } from "typeorm";

import { GetUsersRequest, UserClientService, UsersResponse } from "~user-client";
import { NATS_CLIENT } from "~nats-client";

import { CreateSellerDto, UpdateSellerDto } from "./dtos";
import { SellerDetailVM, SellerVM } from "./vms";
import { SellerEntity } from "./entities";

@Injectable()
export class SellerService extends RepositoryService<SellerEntity> {
  constructor(
    @InjectRepository(SellerEntity) sellerRepository: Repository<SellerEntity>,
    @Inject(NATS_CLIENT) private readonly natsClient: ClientProxy,
    private readonly userClientService: UserClientService,
    private readonly i18nService: I18nService,
  ) {
    super(sellerRepository);
  }

  async createSellerAndSync(userId: string, data: CreateSellerDto): Promise<SellerVM> {
    const createdSeller = this.create({
      userId,
      ...data,
    });

    this.natsClient.emit("user.update", {
      id: userId,
      updates: {
        isSeller: true,
      },
    });

    return createdSeller;
  }

  async getSellers(userId?: string): Promise<Array<SellerVM | SellerDetailVM>> {
    const sellers = await this.getMultiple([{ userId }, {}]);

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

  async authUpdate(userId: string, id: string, updates: UpdateSellerDto): Promise<SellerVM> {
    const seller = await this.getOrThrow({ id }, { select: ["userId"] });

    if (seller.userId !== userId) {
      throw new ForbiddenException(this.i18nService.t("seller.forbidden-update"));
    }

    return (await this.update({ id, userId }, updates))!;
  }
}
