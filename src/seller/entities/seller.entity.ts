import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { RatingEntity, IRating } from "~rating";

import { ISeller } from "../interfaces";

@Entity("sellers")
export class SellerEntity implements ISeller {
  @PrimaryGeneratedColumn("identity")
  id: string;

  @Column({ name: "user_id", length: 20 })
  userId: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: "text" })
  description: string;

  @Column({ name: "logo_url", nullable: true })
  logoUrl?: string;

  @Column("float", { default: 0 })
  rating: number;

  @Column({ name: "tax_id", nullable: true })
  taxId?: string;

  @Column({ name: "is_verified", default: false })
  isVerified: boolean;

  @Column({ name: "is_locked", default: false })
  isLocked: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @OneToMany(() => RatingEntity, (rating) => rating.seller)
  ratings: IRating[];
}
