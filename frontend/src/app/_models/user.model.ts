export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
  accessToken?: string;
  tokenType?: string;
}

export interface LoginResponse {
    token: string;
    type: string;
    id: string;
    username: string;
    email: string;
    roles: string[];
}