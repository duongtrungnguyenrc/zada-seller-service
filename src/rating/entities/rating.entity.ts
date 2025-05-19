import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { IShop, ShopEntity } from "~shop";

import { IRating } from "../interfaces";

@Entity("ratings")
export class RatingEntity implements IRating {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "uuid" })
  userId: string;

  @ManyToOne(() => ShopEntity, (shop) => shop.ratings)
  shop: IShop;

  @Column({ type: "int", default: 5 })
  stars: number;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
