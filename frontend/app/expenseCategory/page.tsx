"use client";
import { useEffect, useState } from "react";
import ProtectedContent from "../component/ProtectedContent";
import ExpenseCategoryResponse from "../types/ExpenseCategoryResponse";
import { getExpenseCategories } from "../api/expenseCategory";
import { Card } from "primereact/card";
import styles from "./styles.module.scss";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";

export default function ExpenseCategory() {
  const router = useRouter();
  const [expenseCategories, setExpenseCategories] =
    useState<ExpenseCategoryResponse[]>();

  useEffect(() => {
    getExpenseCategories().then((response) => {
      setExpenseCategories(response.expenseCategories);
    });
  }, []);

  const pageContent =
    expenseCategories === undefined ? (
      <p>Loading</p>
    ) : (
      <>
        <h2 className="p-ml-4">My Expense Categories</h2>
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
            <Card
              key={expenseCategory.id}
              title={expenseCategory.name}
              className={styles.categoryCard}
              subTitle={`Expenses: ${expenseCategory.expenseCount}`}
              data-testid="expense-category-card"
            >
              {expenseCategory.description ? (
                <p>{expenseCategory.description}</p>
              ) : (
                <>
                  <InputText
                    placeholder="Add a description"
                    className={styles.inputText}
                  />
                  <Button
                    icon="pi pi-check"
                    className=""
                    rounded
                    aria-label="Filter"
                  />
                </>
              )}
            </Card>
          );
        })}
      </>
    );
  return <ProtectedContent pageContent={pageContent} />;
}
