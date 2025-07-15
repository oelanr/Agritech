 export interface AuthResponse {
  token: string;
}

 export interface AuthErrorResponse {
  error: string;
}

 export interface ProfileResponse {
  username: string;
}

 export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {}
