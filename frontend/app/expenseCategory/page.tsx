"use client";
import { useEffect, useState } from "react";
import ProtectedContent from "../component/ProtectedContent";
import ExpenseCategoryResponse from "../types/ExpenseCategoryResponse";
import { getExpenseCategories } from "../api/expenseCategory";
import styles from "./styles.module.scss";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import { getExpenses } from "../api/expense";

export default function ExpenseCategory() {
  const router = useRouter();
  const [expenseCategories, setExpenseCategories] =
    useState<ExpenseCategoryResponse[]>();
  const [totalCategories, setTotalCategories] = useState(0);

  const [categoryIdToExpenseMap, setCategoryIdToExpenseMap] = useState<{
    [categoryId: string]: number;
  }>({});

  useEffect(() => {
    getExpenseCategories().then((response) => {
      setExpenseCategories(response.expenseCategories);
      setTotalCategories(response.totalRecords);
    });

    const currentDate = new Date();
    const expenseQueryParams = {
      startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      endDate: currentDate,
      expenseCategories: [],
    };
    getExpenses(expenseQueryParams).then((response) => {
      const expenses = response.expenses;
      const expenseCategoryMap = {};
      expenses.forEach((expense) => {
        const categoryId = expense.expenseCategory.id;
        const amount = expense.amount;

        if (expenseCategoryMap[categoryId]) {
          expenseCategoryMap[categoryId] += amount;
        } else {
          expenseCategoryMap[categoryId] = amount;
        }
      });
      setCategoryIdToExpenseMap(expenseCategoryMap);
    });
  }, []);

  const pageContent =
    expenseCategories === undefined ? (
      <p>Loading</p>
    ) : (
      <>
        <h2 className="p-ml-4 p-mb-0">
          Expense Categories ({totalCategories})
        </h2>
        <Button
          className={styles.addCategoryButton}
          size="small"
          icon="pi pi-plus"
          label="Add"
          rounded
          data-testid="add-button"
          onClick={() => router.push("/expenseCategory/addCategory")}
        />

        {expenseCategories.map((expenseCategory) => {
          return (
            <div
              key={expenseCategory.id}
              className={styles.categoryCard}
              data-testid="expense-category-card"
            >
              <h2>{expenseCategory.name}</h2>
              <p className={styles.categoryDescription}>
                {expenseCategory.description
                  ? expenseCategory.description
                  : "Add description?"}
              </p>
              <div className={styles.categoryDetails}>
                <p>Expense count: {expenseCategory.expenseCount}</p>
                <p>
                  Total Expenses: ₹
                  {categoryIdToExpenseMap[expenseCategory.id]
                    ? categoryIdToExpenseMap[expenseCategory.id]
                    : 0}
                </p>
              </div>
            </div>
          );
        })}
      </>
    );
  return <ProtectedContent pageContent={pageContent} />;
}
