import { IShop } from "~shop";

export interface IRating {
  id: string;
  userId: string;
  shop: IShop;
  stars: number;
  content: string;
  createdAt: Date;
}
