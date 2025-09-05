import { Request, Response, NextFunction } from 'express';
import { sendBadRequest } from '../utils';

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, username, password, firstName, lastName } = req.body;

  if (!email || !username || !password) {
    sendBadRequest(res, 'Email, username, and password are required');
    return;
  }

  if (!isValidEmail(email)) {
    sendBadRequest(res, 'Please provide a valid email address');
    return;
  }

  if (!isValidUsername(username)) {
    sendBadRequest(res, 'Username must be 3-20 characters and contain only letters, numbers, and underscores');
    return;
  }

  if (!isValidPassword(password)) {
    sendBadRequest(res, 'Password must be at least 8 characters long');
    return;
  }

  if (firstName && (firstName.length < 1 || firstName.length > 50)) {
    sendBadRequest(res, 'First name must be 1-50 characters');
    return;
  }

  if (lastName && (lastName.length < 1 || lastName.length > 50)) {
    sendBadRequest(res, 'Last name must be 1-50 characters');
    return;
  }

  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    sendBadRequest(res, 'Email and password are required');
    return;
  }

  if (!isValidEmail(email)) {
    sendBadRequest(res, 'Please provide a valid email address');
    return;
  }

  next();
};

export const validateUpdateUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { firstName, lastName, bio } = req.body;

  if (firstName && (firstName.length < 1 || firstName.length > 50)) {
    sendBadRequest(res, 'First name must be 1-50 characters');
    return;
  }

  if (lastName && (lastName.length < 1 || lastName.length > 50)) {
    sendBadRequest(res, 'Last name must be 1-50 characters');
    return;
  }

  if (bio && bio.length > 500) {
    sendBadRequest(res, 'Bio must be less than 500 characters');
    return;
  }

  next();
};

export const validateUUID = (paramName: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const value = req.params[paramName];
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(value)) {
      sendBadRequest(res, `Invalid ${paramName} format`);
      return;
    }

    next();
  };
};

export const validateCreatePost = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { content } = req.body;

  next();
};

export const validateUpdatePost = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { title, content } = req.body;

  if (title && (title.length < 3 || title.length > 100)) {
    sendBadRequest(res, 'Title must be 3-100 characters');
    return;
  }



  next();
};
