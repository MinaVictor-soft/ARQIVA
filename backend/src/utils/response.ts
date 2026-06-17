import { Response } from "express";
import { ApiResponse, PaginatedResponse } from "./types";

export function sendResponse<T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T
): Response {
  const response: ApiResponse<T> = {
    success: statusCode < 400,
    message,
    data,
  };
  return res.status(statusCode).json(response);
}

export function sendPaginatedResponse<T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
  message: string = "Success"
): Response {
  const pages = Math.ceil(total / limit);
  const response: PaginatedResponse<T> = {
    data,
    pagination: {
      total,
      page,
      limit,
      pages,
    },
  };
  return res.status(200).json({
    success: true,
    message,
    ...response,
  });
}

export function sendError(
  res: Response,
  statusCode: number,
  message: string,
  error?: any
): Response {
  const response: ApiResponse = {
    success: false,
    message,
    error: process.env.NODE_ENV === "development" ? error : undefined,
  };
  return res.status(statusCode).json(response);
}

export function handleError(error: any): { statusCode: number; message: string } {
  if (error.statusCode) {
    return { statusCode: error.statusCode, message: error.message };
  }

  if (error.code === "P2025") {
    return { statusCode: 404, message: "Resource not found" };
  }

  if (error.code === "P2002") {
    return {
      statusCode: 409,
      message: `Unique constraint failed on ${error.meta?.target?.[0] || "field"}`,
    };
  }

  return {
    statusCode: 500,
    message: error.message || "An unexpected error occurred",
  };
}

export function getPaginationParams(
  query: any
): { skip: number; take: number; page: number } {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;

  return { skip, take: limit, page };
}
