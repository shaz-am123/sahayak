import { IsNotEmpty, validate } from "class-validator";
import { CustomValidationError } from "../errors/CustomValidationError";

class CreateCategoryRequest {
  @IsNotEmpty({message: "Category name is required"})
  name: string;

  description: string;

  constructor(data: { name: string; description: string }) {
    this.name = data.name;
    this.description = data.description;
  }

  async validateRequest() {
    const validationErrors = await validate(this);
    if (validationErrors.length > 0) {
      throw new CustomValidationError("Validation error: ", validationErrors);
    }
  }
}

export default CreateCategoryRequest;
