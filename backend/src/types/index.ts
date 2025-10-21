export interface JwtPayload {
  userId: string;
  email: string;
  username: string;
  role: 'user' | 'admin';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
