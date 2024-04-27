import MultipleExpenseCategoriesResponse from "../app/types/MultipleExpenseCategoriesResponse";

const mockExpenseCategories: MultipleExpenseCategoriesResponse = {
  expenseCategories: [
    {
      id: "1",
      userId: "A001",
      name: "Food",
      description: "Lunch",
      expenseCount: 1,
    },
    {
      id: "2",
      userId: "A001",
      name: "Travel",
      description: "Train Ticket",
      expenseCount: 2,
    },
    {
      id: "3",
      userId: "A001",
      name: "Vehicle",
      description: "Fuel and servicing",
      expenseCount: 3,
    },
  ],
  totalRecords: 3,
};

export default mockExpenseCategories;
