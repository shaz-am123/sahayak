import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { useFormik } from "formik";
import { addExpense } from "../../api/expense";
import { Dropdown } from "primereact/dropdown";
import { getExpenseCategories } from "../../api/expenseCategory";
import ExpenseCategoryResponse from "../../types/ExpenseCategoryResponse";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";

export default function ExpenseForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [expenseCategories, setExpenseCategories] =
    useState<ExpenseCategoryResponse[]>();

  useEffect(() => {
    getExpenseCategories().then((response) => {
      setExpenseCategories(response.expenseCategories);
    });
  }, []);

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        amount: "",
        expenseCategory: null,
        description: "",
        date: null,
      },
      // validationSchema: expenseCategoryFormSchema,
      onSubmit: (values, action) => {
        setLoading(true);
        addExpense(
          {
            ...values,
            expenseCategoryId: values.expenseCategory.id,
            amount: parseInt(values.amount, 10)
          },
          router
        ).then(() => {
          action.resetForm();
          setLoading(false);
        });
      },
    });

  return (
    <form
      className={styles.formContainer}
      data-testid="expense-form"
      onSubmit={handleSubmit}
    >
      <h2 data-testid="heading">Add Expense</h2>
      <label
        className={`${styles.fieldLabel} ${styles.requiredField}`}
        htmlFor="amount"
      >
        Amount
      </label>
      <InputText
        id="amount"
        keyfilter="pint"
        onChange={handleChange}
        value={values.amount}
        onBlur={handleBlur}
        className={`${errors.amount && touched.amount ? "p-invalid" : ""} ${styles.inputField}`}
      />
      {errors.amount && touched.amount && (
        <p className={styles.fieldError}>{errors.amount}</p>
      )}

      <label
        className={`${styles.fieldLabel} ${styles.requiredField}`}
        htmlFor="expenseCategory"
      >
        Expense-category
      </label>
      <Dropdown
        id="expenseCategory"
        value={values.expenseCategory}
        onChange={handleChange}
        options={expenseCategories}
        placeholder="Select a expense-category"
        optionLabel="name"
        className={`${errors.expenseCategory && touched.expenseCategory ? "p-invalid" : ""} ${styles.inputField}`}
      />
      {errors.expenseCategory && touched.expenseCategory && (
        <p className={styles.fieldError}>{errors.expenseCategory}</p>
      )}

      <label className={`${styles.fieldLabel}`} htmlFor="description">
        Description
      </label>
      <InputText
        id="description"
        onChange={handleChange}
        value={values.description}
        onBlur={handleBlur}
        className={`${errors.description && touched.description ? "p-invalid" : ""} ${styles.inputField}`}
      />
      {errors.description && touched.description && (
        <p className={styles.fieldError}>{errors.description}</p>
      )}

      <label
        className={`${styles.fieldLabel} ${styles.requiredField}`}
        htmlFor="date"
      >
        Date Of Expenditure
      </label>
      <Calendar
        showIcon
        id="date"
        name="date"
        onChange={handleChange}
        value={values.date}
        onBlur={handleBlur}
        className={`${errors.date && touched.date ? "p-invalid" : ""} ${styles.inputField}`}
      />
      {errors.date && touched.date && (
        <p className={styles.fieldError}>{errors.date}</p>
      )}

      <Button
        label={loading ? "..." : "Add"}
        type="submit"
        className={styles.button}
      />
    </form>
  );
}
