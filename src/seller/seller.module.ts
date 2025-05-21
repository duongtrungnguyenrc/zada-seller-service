import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

import { SellerController } from "./seller.controller";
import { SellerService } from "./seller.service";
import { SellerEntity } from "./entities";

@Module({
  imports: [TypeOrmModule.forFeature([SellerEntity])],
  controllers: [SellerController],
  providers: [SellerService],
  exports: [SellerService],
})
export class SellerModule {}
