import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { normalizeArabicDeep } from '../helpers/normalize-arabic.helper';

@Injectable()
export class NormalizeArabicMiddleware implements NestMiddleware {
  use(req: Request, _: Response, next: NextFunction): void {
    if (req.body !== undefined) {
      req.body = normalizeArabicDeep(req.body);
    }

    if (req.params) {
      normalizeArabicDeep(req.params);
    }

    if (req.query) {
      try {
        req.query = normalizeArabicDeep(req.query);
      } catch {
        normalizeArabicDeep(req.query);
      }
    }

    next();
  }
}
