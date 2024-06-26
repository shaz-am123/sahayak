import {
  IsNumber,
  IsString,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsPositive,
} from "class-validator";

class ExpenseRequest {
  @IsNotEmpty({ message: "Amount must not be empty" })
  @IsNumber({}, { message: "Amount must be a number" })
  @IsPositive({ message: "Amount must be a positive number" })
  amount: number;

  @IsNotEmpty({ message: "Expense category ID must not be empty" })
  @IsString({ message: "Expense category ID must be a string" })
  expenseCategoryId: string;

  @IsString({ message: "Description must be a string" })
  description: string;

  @IsNotEmpty({ message: "Date must not be empty" })
  @IsDate({ message: "Invalid date" })
  date: Date;

  constructor(data: {
    amount: number;
    expenseCategoryId: string;
    description: string;
    date: Date;
  }) {
    this.amount = data.amount;
    this.expenseCategoryId = data.expenseCategoryId;
    this.description = data.description;
    this.date = data.date;
  }
}

export default ExpenseRequest;
