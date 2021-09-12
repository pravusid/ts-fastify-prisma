import { validateSync } from 'class-validator';
import { PublicError } from '../domain/public-error';

export abstract class BaseDto {
  validate(): void {
    const result = validateSync(this);
    if (result.length) {
      throw new PublicError(result.flatMap(res => Object.values(res.constraints ?? {})).join(', '));
    }
  }
}
