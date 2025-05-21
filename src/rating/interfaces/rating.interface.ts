import { ISeller } from "~seller";

export interface IRating {
  id: string;
  userId: string;
  seller: ISeller;
  stars: number;
  content: string;
  createdAt: Date;
}
