import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./styles.module.scss";
import { useFormik } from "formik";
import expenseCategoryFormSchema from "./expenseCategoryFormSchema";
import { addExpenseCategory } from "../../api/expenseCategory";
import { InputTextarea } from "primereact/inputtextarea";

export default function ExpenseCategoryForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        name: "",
        description: "",
      },
      validationSchema: expenseCategoryFormSchema,
      onSubmit: (values, action) => {
        setLoading(true);
        addExpenseCategory({ ...values }, router).then(() => {
          action.resetForm();
          setLoading(false);
        });
      },
    });

  return (
    <form
      className={styles.formContainer}
      data-testid="expenseCategoryForm"
      onSubmit={handleSubmit}
    >
      <h2 data-testid="heading">Add Expense-Category</h2>
      <label
        className={`${styles.fieldLabel} ${styles.requiredField}`}
        htmlFor="name"
      >
        Expense-category name
      </label>
      <InputText
        id="name"
        autoComplete="off"
        onChange={handleChange}
        value={values.name}
        onBlur={handleBlur}
        className={`${errors.name && touched.name ? "p-invalid" : ""} ${styles.inputField}`}
      />
      {errors.name && touched.name && (
        <p className={styles.fieldError}>{errors.name}</p>
      )}

      <label className={`${styles.fieldLabel}`} htmlFor="description">
        Description
      </label>
      <InputTextarea
        autoResize
        rows={5}
        id="description"
        autoComplete="off"
        onChange={handleChange}
        onBlur={handleBlur}
        className={`${errors.description && touched.description ? "p-invalid" : ""} ${styles.inputField}`}
        value={values.description}
      />
      {errors.description && touched.description ? (
        <p className={styles.fieldError}>{errors.description}</p>
      ) : null}

      <Button
        label={loading ? "..." : "Add"}
        type="submit"
        className={styles.button}
      />
    </form>
  );
}
