"use client";
import ProtectedContent from "../component/ProtectedContent";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import { getExpenses } from "../api/expense";
import ExpenseResponse from "../types/ExpenseResponse";

export default function Expense() {
  const [expenses, setExpenses] = useState<ExpenseResponse[]>();

  useEffect(() => {
    getExpenses().then((response) => {
      setExpenses(response.expenses);
    });
  }, []);
  const expenseTableColumns = [
    {
      field: "amount",
      header: "Amount(₹)",
      sort: true,
    },
    {
      field: "expenseCategory.name",
      header: "Category",
      sort: false,
    },
    {
      field: "date",
      header: "Date",
      sort: true,
      body: (rowData: any) => {
        const date = new Date(rowData.date);

        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        });
      },
    },
    {
      field: "description",
      header: "Description",
      sort: false,
    },
  ];

  const getExpenseTableColumns = () =>
    expenseTableColumns.map((column) => (
      <Column
        key={column.header}
        field={column.field}
        header={column.header}
        sortable={column.sort}
        {...(column.body && { body: column.body })}
      />
    ));
  const pageContent =
    expenses === undefined ? (
      <p>Loading</p>
    ) : (
      <>
        <h2>My Expenses</h2>
        <DataTable
          stripedRows
          showGridlines
          value={expenses}
          data-testid="expenses-table"
        >
          {getExpenseTableColumns()}
        </DataTable>
      </>
    );
  return <ProtectedContent pageContent={pageContent} />;
}
