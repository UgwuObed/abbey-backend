import { Response } from 'express';
import { ApiResponse } from '../types';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200
): void => {
  const response: ApiResponse<T> = {
    status: 'SUCCESS',
    message,
    data
  };
  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 500
): void => {
  const response: ApiResponse = {
    status: 'ERROR',
    message
  };
  res.status(statusCode).json(response);
};

export const sendCreated = <T>(
  res: Response,
  data: T,
  message = 'Resource created successfully'
): void => {
  sendSuccess(res, data, message, 201);
};

export const sendNotFound = (
  res: Response,
  message = 'Resource not found'
): void => {
  sendError(res, message, 404);
};

export const sendBadRequest = (
  res: Response,
  message = 'Bad request'
): void => {
  sendError(res, message, 400);
};

export const sendUnauthorized = (
  res: Response,
  message = 'Unauthorized'
): void => {
  sendError(res, message, 401);
};

export const sendForbidden = (
  res: Response,
  message = 'Forbidden'
): void => {
  sendError(res, message, 403);
};
