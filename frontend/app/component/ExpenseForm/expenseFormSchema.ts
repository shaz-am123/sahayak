import * as Yup from "yup";
import { isUniqueCategory } from "../../api/expenseCategory";

const expenseCategoryFormSchema = Yup.object({
  name: Yup.string()
    .required("Category name is required")
    .test(
      "is-unique",
      "Expense Category already exists",
      async function (value) {
        if (!value) return true;
        const response = await isUniqueCategory(value);
        return response.isUnique;
      },
    ),
});

export default expenseCategoryFormSchema;
