import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import qs from 'qs';

@Injectable()
export class ParseQueryMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ParseQueryMiddleware.name);

  use(req: Request, _: Response, next: NextFunction): void {
    try {
      const url = req.originalUrl || req.url;

      if (!url || !url.includes('?')) {
        return next();
      }

      const queryIndex = url.indexOf('?');
      const queryString = url.slice(queryIndex + 1);

      if (!queryString) {
        return next();
      }

      const parsedQuery = qs.parse(queryString, {
        allowDots: true,
        allowPrototypes: false,
        decoder: (str: string) => {
          try {
            return decodeURIComponent(str);
          } catch {
            return str;
          }
        },
      });

      Object.defineProperty(req, 'query', {
        value: parsedQuery,
        writable: false,
        configurable: true,
        enumerable: true,
      });

      next();
    } catch (error: any) {
      this.logger.error(`Failed to parse query string: ${error.message}`, error.stack);
      next();
    }
  }
}
