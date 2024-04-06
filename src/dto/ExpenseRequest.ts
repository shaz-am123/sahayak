import { IsNumber, IsString, IsDate, IsEnum, IsNotEmpty } from 'class-validator';
import Currency from '../enums/Currency';

class ExpenseRequest {
  @IsNotEmpty({ message: 'Amount must not be empty' })
  @IsNumber({}, { message: 'Amount must be a number' })
  amount: number;

  @IsNotEmpty({ message: 'Currency must not be empty' })
  @IsEnum(Currency, { message: 'Invalid currency' })
  currency: Currency;

  @IsNotEmpty({ message: 'Expense category ID must not be empty' })
  @IsString({ message: 'Expense category ID must be a string' })
  expenseCategoryId: string;

  @IsString({ message: 'Description must be a string' })
  description: string;

  @IsNotEmpty({ message: 'Date must not be empty' })
  @IsDate({ message: 'Invalid date' })
  date: Date;

  constructor(data:{amount: number, expenseCategoryId: string, description: string, date: Date, currency: Currency}) {
    this.amount = data.amount;
    this.currency = data.currency;
    this.expenseCategoryId = data.expenseCategoryId;
    this.description = data.description;
    this.date = data.date;
  }
}

export default ExpenseRequest;