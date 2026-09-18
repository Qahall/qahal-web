export interface GetArgs {
  page?: number;
  page_size?: number;
  order_by?: string;
  order_dir?: string;
  filters?: Filters;
}
export interface Filters {
  [key: string]: any;
}
