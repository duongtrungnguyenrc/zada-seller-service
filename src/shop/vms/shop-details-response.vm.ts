import { withBaseResponse } from "@duongtrungnguyen/micro-commerce";

import { ShopDetailVM } from "./shop-detail.vm";

export class ShopDetailsResponseVM extends withBaseResponse([ShopDetailVM] as any) {}
