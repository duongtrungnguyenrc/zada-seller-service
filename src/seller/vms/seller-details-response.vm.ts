import { withBaseResponse } from "@duongtrungnguyen/micro-commerce";

import { SellerDetailVM } from "./seller-detail.vm";

export class SellerDetailsResponseVM extends withBaseResponse([SellerDetailVM] as any) {}
