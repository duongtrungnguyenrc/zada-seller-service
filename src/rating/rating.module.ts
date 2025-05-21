import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

import { SellerModule } from "~seller";

import { RatingController } from "./rating.controller";
import { RatingService } from "./rating.service";
import { RatingEntity } from "./entities";

@Module({
  imports: [TypeOrmModule.forFeature([RatingEntity]), SellerModule],
  providers: [RatingService],
  controllers: [RatingController],
})
export class RatingModule {}
