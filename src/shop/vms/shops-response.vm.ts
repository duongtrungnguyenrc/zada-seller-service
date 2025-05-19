import { withBaseResponse } from "@duongtrungnguyen/micro-commerce";

import { ShopVM } from "./shop.vm";

export class ShopsResponseVM extends withBaseResponse([ShopVM] as any) {}
