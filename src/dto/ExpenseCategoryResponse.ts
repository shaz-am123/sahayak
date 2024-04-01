class ExpenseCategoryResponse {
  id: string;
  userId: string;
  name: string;
  description: string;

  constructor(data: { id: string; userId: string, name: string; description: string }) {
    this.id = data.id;
    this.userId = data.userId;
    this.name = data.name;
    this.description = data.description;
  }
}

export default ExpenseCategoryResponse;
