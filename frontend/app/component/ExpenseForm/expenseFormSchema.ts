import * as Yup from "yup";

const expenseFormSchema = Yup.object({
  amount: Yup.number().required("Amount is required"),
  expenseCategory: Yup.object().required("Expense category is required"),
  date: Yup.date().required("Date is required"),
});

export default expenseFormSchema;
