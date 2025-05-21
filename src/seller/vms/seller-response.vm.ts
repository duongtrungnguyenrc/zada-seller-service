import { withBaseResponse } from "@duongtrungnguyen/micro-commerce";

import { SellerVM } from "./seller.vm";

export class SellerResponseVM extends withBaseResponse(SellerVM) {}
