import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { RatingEntity, IRating } from "~rating";

import { IShop } from "../interfaces";

@Entity("shops")
export class ShopEntity implements IShop {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  userId: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  logoUrl?: string;

  @Column("float", { default: 0 })
  rating: number;

  @Column({ nullable: true })
  taxId?: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: false })
  isLocked: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => RatingEntity, (rating) => rating.shop)
  ratings: IRating[];
}
