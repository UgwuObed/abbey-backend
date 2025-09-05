import { Request, Response, NextFunction } from 'express';

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();
  const { method, url, ip } = req;


  console.log(`[${new Date().toISOString()}] ${method} ${url} - ${ip}`);


  const originalEnd = res.end.bind(res);

  res.end = function(chunk?: any, encoding?: any) {
    const duration = Date.now() - start;
    const { statusCode } = res;
    
    console.log(
      `[${new Date().toISOString()}] ${method} ${url} - ${ip} - ${statusCode} - ${duration}ms`
    );
    
    return originalEnd(chunk, encoding);
  };

  next();
};