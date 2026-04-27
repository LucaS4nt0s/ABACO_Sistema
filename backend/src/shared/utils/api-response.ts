export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
}

export function successResponse<T>(data: T): ApiSuccess<T> {
  return {
    success: true,
    data,
  };
}

export function errorResponse(message: string): ApiError {
  return {
    success: false,
    message,
  };
}
