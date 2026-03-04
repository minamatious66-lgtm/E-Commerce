export interface LoginResponse {
  message: string;
  user: {
    name: string;
    email: string;
    role: string;
  };
  token: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    name: string;
    email: string;
    role: string;
  };
  token?: string;
}

export interface ForgotPasswordResponse {
  statusMsg: string;
  message: string;
}

export interface VerifyResetCodeResponse {
  status: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  token: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  password: string;
  rePassword: string;
}

export interface ChangePasswordResponse {
  message: string;
  token: string;
}
