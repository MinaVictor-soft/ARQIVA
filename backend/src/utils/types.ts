import { Request } from "express";
import { TokenPayload } from "./auth";

export interface CustomRequest extends Request {
  user?: TokenPayload;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
