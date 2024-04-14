import { ValidationError } from "class-validator";

export class CustomValidationError extends Error {
  constructor(
    message: string,
    public validationErrors: ValidationError[],
  ) {
    super(message);
    Object.setPrototypeOf(this, CustomValidationError.prototype);
  }
}
