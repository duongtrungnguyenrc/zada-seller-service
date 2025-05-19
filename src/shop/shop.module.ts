import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

import { ShopController } from "./shop.controller";
import { ShopService } from "./shop.service";
import { ShopEntity } from "./entities";

@Module({
  imports: [TypeOrmModule.forFeature([ShopEntity])],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {}
