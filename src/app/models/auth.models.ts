export interface LoginRequest {
    username: string;
    password: string;
  }
  
  export interface LoginResponse {
    tokens: {
        accessToken: string;
    };
    user: {
      username: string;
      id: string;
    };
  }
  
  export interface AuthState {
    isAuthenticated: boolean;
    user?: {
      username: string;
      id: string;
    };
  }