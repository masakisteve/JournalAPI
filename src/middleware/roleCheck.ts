import { Request, Response, NextFunction } from 'express';

export const checkRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const userRoles = (req as any).user.roles;
        
        const hasRole = roles.some(role => userRoles.includes(role));
        if (!hasRole) {
            res.status(403).json({ message: "Access forbidden" });
            return;
        }

        next();
    };
};