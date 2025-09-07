import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
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
        decoder: (
          str: string,
          defaultDecoder: any,
          charset: string,
          type: 'key' | 'value',
        ) => {
          try {
            let decoded = str;

            try {
              decoded = decodeURIComponent(decoded);
            } catch {
              try {
                decoded = unescape(decoded);
              } catch {
                decoded = str;
              }
            }

            decoded = decoded
              .replace(/\+/g, ' ')
              .replace(/%20/g, ' ')
              .replace(/%2B/g, '+')
              .replace(/%26/g, '&')
              .replace(/%3D/g, '=')
              .replace(/%2F/g, '/')
              .replace(/%3A/g, ':')
              .replace(/%3B/g, ';')
              .replace(/%2C/g, ',')
              .replace(/%3F/g, '?')
              .replace(/%23/g, '#');

            return decoded;
          } catch (error) {
            this.logger.warn(`Failed to decode query parameter: ${str}`, error);
            return str;
          }
        },
        depth: 10,
        arrayLimit: 100,
        duplicates: 'combine',
      });

      if (parsedQuery && Object.keys(parsedQuery).length > 0) {
        Object.defineProperty(req, 'query', {
          value: parsedQuery,
          writable: false,
          configurable: true,
          enumerable: true,
        });

        this.logger.debug(`Parsed query parameters:`, parsedQuery);
      }

      next();
    } catch (error: any) {
      this.logger.error(
        `Failed to parse query string: ${error.message}`,
        error.stack,
      );
      Object.defineProperty(req, 'query', {
        value: {},
        writable: false,
        configurable: true,
        enumerable: true,
      });
      next();
    }
  }
}
