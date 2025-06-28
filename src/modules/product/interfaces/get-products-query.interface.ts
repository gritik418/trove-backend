export interface GetProductsQuery {
  limit?: number;
  page?: number;
  search?: string;
  isPublished?: boolean;
  categories?: string[];
}
