import { withBaseResponse } from "@duongtrungnguyen/micro-commerce";

import { ShopVM } from "./shop.vm";

export class ShopResponseVM extends withBaseResponse(ShopVM) {}
