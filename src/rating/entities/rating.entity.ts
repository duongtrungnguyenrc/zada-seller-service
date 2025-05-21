import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { ISeller, SellerEntity } from "~seller";

import { IRating } from "../interfaces";

@Entity("ratings")
export class RatingEntity implements IRating {
  @PrimaryGeneratedColumn("identity")
  id: string;

  @Column({ length: 20 })
  userId: string;

  @ManyToOne(() => SellerEntity, (seller) => seller.ratings)
  seller: ISeller;

  @Column({ type: "int", default: 5 })
  stars: number;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
