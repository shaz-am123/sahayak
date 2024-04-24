import MultipleExpensesResponse from "../../app/types/MultipleExpensesResponse";

const mockExpenses: MultipleExpensesResponse = {
    expenses: [
      {
        id:"1",
        userId: "A001",
        amount: 160,
        expenseCategory: { 
          id: "1",
          userId: "A001",
          name:"Food",
          description: "Lunch",
          expenseCount: 1,
         },
        date: new Date("2022-04-24T00:00:00.000Z"),
        description: "Lunch",
      },
      {
        id:"1",
        userId: "A001",
        amount: 1800,
        expenseCategory: { 
          id: "2",
          userId: "A001",
          name:"Travel",
          description: "Train Ticket",
          expenseCount: 1
        },
        date: new Date("2022-04-25T00:00:00.000Z"),
        description: "Hotel Booking",
      },
    ],
    totalRecords: 2,
  };
  
  export default mockExpenses;