export interface UserListItem {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
  isActive: boolean;
  createdAtUtc: string;
}

export interface PaginatedListResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
