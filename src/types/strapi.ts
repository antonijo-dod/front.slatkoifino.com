import { Pagination } from "./pagination";
// Represents the complete API response structure from Strapi.
export interface StrapiApiResponse<T> {
  data: T[];
  meta: {
    pagination: Pagination;
  };
}
