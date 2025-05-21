import { withBaseResponse } from "@duongtrungnguyen/micro-commerce";

import { SellerVM } from "./seller.vm";

export class SellersResponseVM extends withBaseResponse([SellerVM] as any) {}
