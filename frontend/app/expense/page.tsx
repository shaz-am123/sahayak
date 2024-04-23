"use client";
import ProtectedContent from "../component/ProtectedContent";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import { getExpenses } from "../api/endpoints/expense";

interface ExpenseTable {}
export default function Expense() {
  const [tableData, setTableData] = useState<ExpenseTable[]>([]);

  useEffect(() => {
    getExpenses().then((response) => {
      setTableData(response.expenses);
    });
  }, []);
  const expenseTableColumns = [
    {
      field: "amount",
      header: "Amount",
      sort: true,
    },
    {
      field: "currency",
      header: "Currency",
      sort: false,
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
      }
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
  const pageContent = (
    <>
      <h2>My Expenses</h2>
      <DataTable stripedRows showGridlines value={tableData}>
        {getExpenseTableColumns()}
      </DataTable>
    </>
  );
  return <ProtectedContent pageContent={pageContent} />;
}
