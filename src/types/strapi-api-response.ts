import { Recipe } from "./recipe";
import { Pagination } from "./pagination";

export interface StrapiApiResponse {
  data: Recipe[];
  meta: {
    pagination: Pagination;
  };
}
