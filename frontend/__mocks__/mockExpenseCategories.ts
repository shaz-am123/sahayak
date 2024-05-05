import MultipleExpenseCategoriesResponse from "../app/types/MultipleExpenseCategoriesResponse";

const mockExpenseCategories: MultipleExpenseCategoriesResponse = {
  expenseCategories: [
    {
      id: "1",
      userId: "A001",
      name: "Food",
      description: "Breafast, Lunch, Dinner",
      expenseCount: 1,
    },
    {
      id: "2",
      userId: "A001",
      name: "Travel",
      description: "Travelling costs: bus, flight, train...",
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
