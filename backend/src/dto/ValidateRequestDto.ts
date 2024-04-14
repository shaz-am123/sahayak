import { validate } from "class-validator";
import { CustomValidationError } from "../errors/CustomValidationError";

async function validateRequest(dto: Object) {
  const validationErrors = await validate(dto);
  if (validationErrors.length > 0) {
    throw new CustomValidationError("Validation error: ", validationErrors);
  }
}

export default validateRequest;
