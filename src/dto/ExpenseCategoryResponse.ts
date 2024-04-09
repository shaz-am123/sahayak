class ExpenseCategoryResponse {
  id: string;
  userId: string;
  name: string;
  description: string;
  expenseCount: number;

  constructor(data: {
    id: string;
    userId: string;
    name: string;
    description: string;
    expenseCount: number;
  }) {
    this.id = data.id;
    this.userId = data.userId;
    this.name = data.name;
    this.description = data.description;
    this.expenseCount = data.expenseCount;
  }
}

export default ExpenseCategoryResponse;
