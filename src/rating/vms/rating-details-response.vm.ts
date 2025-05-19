import { withBaseResponse, withPagingData } from "@duongtrungnguyen/micro-commerce";
import { RatingDetailVM } from "./rating-detail.vm";

export class RatingDetailsResponseVM extends withBaseResponse(withPagingData(RatingDetailVM)) {}
