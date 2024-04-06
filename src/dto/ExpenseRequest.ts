import { IsNumber, IsString, IsDate, IsEnum } from 'class-validator';
import Currency from '../enums/Currency';

class ExpenseRequest {
  @IsNumber()
  amount: number;

  @IsEnum(Currency)
  currency: Currency;

  @IsString()
  expenseCategoryId: string;

  @IsString()
  description: string;

  @IsDate()
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