
//create a model

export interface User {
  userId: number;
  username: string;
  password?: string;
  role: string;
  email: string;
  contactNumber: number;
  date: Date | string;
}

export interface UserCreateRequest {
  userId: number;
  username: string;
  password: string;
  role: string;
  email: string;
  contactNumber: number;
  date: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}