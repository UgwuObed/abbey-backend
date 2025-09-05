export interface ApiResponse<T = any> {
  status: 'SUCCESS' | 'ERROR';
  message?: string;
  data?: T;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  skip?: number;
  take?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export interface SearchOptions extends PaginationOptions {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}