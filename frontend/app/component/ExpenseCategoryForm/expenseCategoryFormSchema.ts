import * as Yup from "yup";

const expenseCategoryFormSchema = Yup.object({
  name: Yup.string().required("Category name is required"),
});

export default expenseCategoryFormSchema;
