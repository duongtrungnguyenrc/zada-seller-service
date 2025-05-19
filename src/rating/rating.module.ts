import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

import { ShopModule } from "~shop";

import { RatingController } from "./rating.controller";
import { RatingService } from "./rating.service";
import { RatingEntity } from "./entities";

@Module({
  imports: [TypeOrmModule.forFeature([RatingEntity]), ShopModule],
  providers: [RatingService],
  controllers: [RatingController],
})
export class RatingModule {}
