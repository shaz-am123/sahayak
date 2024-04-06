import { IsNotEmpty, MaxLength, MinLength, validate } from "class-validator";

class ExpenseCategoryRequest {
  @IsNotEmpty({ message: "Expense-category name is required" })
  @MinLength(4, {
    message: "Expense-category name must be at least 2 characters long",
  })
  @MaxLength(30, {
    message: "Expense-category name must be at most 20 characters long",
  })
  name: string;

  description: string;

  constructor(data: { name: string; description: string }) {
    this.name = data.name;
    this.description = data.description;
  }
}

export default ExpenseCategoryRequest;
