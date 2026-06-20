export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
  permissions: string[];
}

export interface AuthResponse {
  accessToken: string;
  expiresAtUtc: string;
  user: UserProfile;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  data: T | null;
  error: ApiError | null;
  statusCode: number;
}

export interface ApiError {
  code: string;
  message: string;
  details: string | null;
}
