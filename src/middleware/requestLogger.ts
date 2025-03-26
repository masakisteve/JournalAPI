import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    logger.info('Incoming request', {
        method: req.method,
        path: req.path,
        query: req.query,
        body: req.method === 'POST' || req.method === 'PUT' ? req.body : undefined,
        ip: req.ip,
        userAgent: req.get('user-agent')
    });
    next();
};