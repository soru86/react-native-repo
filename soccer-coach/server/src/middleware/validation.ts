import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { ValidationError } from '../utils/errors';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Promise.all(validations.map((validation) => validation.run(req)));

      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }

      const formattedErrors: Record<string, string[]> = {};
      errors.array().forEach((error: any) => {
        if (error.type === 'field') {
          const field = error.path;
          if (!formattedErrors[field]) {
            formattedErrors[field] = [];
          }
          formattedErrors[field].push(error.msg);
        }
      });

      const validationError = new ValidationError('Validation failed', formattedErrors);
      return next(validationError);
    } catch (error) {
      return next(error);
    }
  };
};


