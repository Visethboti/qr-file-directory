import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

//use to check for all request route if they input correct password or not
@Injectable()
export class CheckPasswordMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.path.startsWith('/employee')) {
      const headerPassword = req.headers['password'];
      const envPassword = process.env.PASSWORD;
      if (!headerPassword) {
        return res
          .status(403)
          .json({ message: 'Access forbidden: please enter password' });
      }
      if (headerPassword !== envPassword) {
        return res
          .status(403)
          .json({ message: 'Access forbidden: invalid password' });
      }
    }

    next();
  }
}
