import type { Request, Response, NextFunction } from 'express';

type Handler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

export const asyncHandler = (handler: Handler) => (req: Request, res: Response, next: NextFunction) => {
  handler(req, res, next).catch(next);
};
