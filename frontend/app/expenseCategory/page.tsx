"use client";
import { useEffect, useState } from "react";
import ProtectedContent from "../component/ProtectedContent";
import ExpenseCategoryResponse from "../types/ExpenseCategoryResponse";
import { getExpenseCategories } from "../api/expenseCategory";
import styles from "./styles.module.scss";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import { getExpenses } from "../api/expense";
import { Calendar } from "primereact/calendar";

export default function ExpenseCategory() {
  const router = useRouter();
  const [expenseCategories, setExpenseCategories] =
    useState<ExpenseCategoryResponse[]>();
  const [totalCategories, setTotalCategories] = useState(0);

  const currentDate = new Date();
  const [dates, setDates] = useState([
    new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
    currentDate,
  ]);

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
      startDate: dates[0],
      endDate: dates[1] ? dates[1] : currentDate,
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
  }, [dates]);

  const pageContent =
    expenseCategories === undefined ? (
      <p>Loading</p>
    ) : (
      <>
        <h2 className="p-ml-4 p-mb-0">
          Expense Categories ({totalCategories})
        </h2>
        <div className="p-mt-4 p-ml-4">
          <Calendar
            value={dates}
            onChange={(e) => setDates(e.value)}
            selectionMode="range"
            readOnlyInput
            dateFormat="dd M, yy"
            hideOnRangeSelection
            showIcon
            className={styles.dateRangeSelector}
            data-testid="date-range-picker"
          />
        </div>
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
              <h2 style={{ color: "#6366f1" }}>{expenseCategory.name}</h2>
              <p className={styles.categoryDescription}>
                {expenseCategory.description
                  ? expenseCategory.description
                  : "Add description?"}
              </p>
              <p className={styles.categoryDetail}>
                Total Expenses: ₹
                {categoryIdToExpenseMap[expenseCategory.id]
                  ? categoryIdToExpenseMap[expenseCategory.id]
                  : 0}
              </p>
            </div>
          );
        })}
      </>
    );
  return <ProtectedContent pageContent={pageContent} />;
}
