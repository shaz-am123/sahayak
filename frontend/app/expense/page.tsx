"use client";
import ProtectedContent from "../component/ProtectedContent";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useRef, useState } from "react";
import { getExpenses } from "../api/expense";
import ExpenseResponse from "../types/ExpenseResponse";
import { Button } from "primereact/button";
import styles from "./styles.module.scss";
import { useRouter } from "next/navigation";
import { OverlayPanel } from "primereact/overlaypanel";
import { TabPanel, TabView } from "primereact/tabview";
import { Calendar } from "primereact/calendar";
import ExpenseCategoryResponse from "../types/ExpenseCategoryResponse";
import { getExpenseCategories } from "../api/expenseCategory";
import { Checkbox } from "primereact/checkbox";
import FilterChip from "../component/FilterChip";
import expenseTableColumns from "./ExpenseTableColumns";
import { ExpenseQueryParams } from "../types/ExpenseQueryParams";

export default function Expense() {
  const router = useRouter();
  const filterPanel = useRef(null);

  const currentDate = new Date();
  const [dates, setDates] = useState([
    new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
    currentDate,
  ]);

  const [expenses, setExpenses] = useState<ExpenseResponse[]>();
  const [categories, setCategories] = useState<ExpenseCategoryResponse[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const [selectedCategories, setSelectedCategories] = useState<
    ExpenseCategoryResponse[]
  >([]);

  const removeFilter = (categoryId: string) => {
    let _selectedCategories = [...selectedCategories];
    _selectedCategories = _selectedCategories.filter(
      (category) => category.id !== categoryId,
    );

    setSelectedCategories(_selectedCategories);
  };

  const addFilter = (expenseCategory: ExpenseCategoryResponse) => {
    let _selectedCategories = [...selectedCategories];

    _selectedCategories.push(expenseCategory);
    setSelectedCategories(_selectedCategories);
  };

  const onCategoryChange = (e) => {
    if (e.checked) {
      addFilter(e.value);
    } else removeFilter(e.value.id);
  };

  useEffect(() => {
    const currentDate = new Date();
    const expenseQueryParams: ExpenseQueryParams = {
      startDate: dates[0],
      endDate: dates[1] ? dates[1] : currentDate,
      expenseCategories: selectedCategories.map((it) => it.id),
    };
    getExpenses(expenseQueryParams).then((response) => {
      const expenses = response.expenses;
      setExpenses(expenses);
      const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);
      setTotalAmount(total);
      setTotalRecords(response.totalRecords);
    });

    getExpenseCategories().then((response) =>
      setCategories(response.expenseCategories),
    );
  }, [selectedCategories, dates]);

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

  const totalRow = (
    <div data-testid="total-row">
      <span>Total Records: {totalRecords}</span>
      <span className={styles.totalAmountSpan}>
        Total Amount: ₹{totalAmount}
      </span>
    </div>
  );

  const pageContent =
    expenses === undefined ? (
      <p>Loading</p>
    ) : (
      <>
        <h2>My Expenses</h2>
        <div className={styles.filters} data-testid="expense-filters">
          <div className={styles.dateFilter}>
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
            size="small"
            icon="pi pi-filter"
            rounded
            label="Filter"
            className="p-mb-2"
            onClick={(e) => filterPanel.current.toggle(e)}
            data-testid="filter-button"
          />
        </div>

        <OverlayPanel
          ref={filterPanel}
          showCloseIcon
          closeOnEscape
          className={styles.filterPanel}
        >
          <TabView>
            <TabPanel header="Expense Category" data-testid="filter-panel">
              {categories.map((category) => {
                return (
                  <div
                    key={category.id}
                    className={`flex p-my-2 ${styles.filterOptions}`}
                  >
                    <Checkbox
                      inputId={category.id}
                      name="category"
                      value={category}
                      onChange={onCategoryChange}
                      checked={selectedCategories.some(
                        (item) => item.id === category.id,
                      )}
                    />
                    <label htmlFor={category.id} className="p-mx-2">
                      {category.name}
                    </label>
                  </div>
                );
              })}
            </TabPanel>
          </TabView>
        </OverlayPanel>

        <Button
          className={styles.addExpenseButton}
          size="small"
          icon="pi pi-plus"
          label="Add"
          rounded
          data-testid="add-button"
          onClick={() => router.push("/expense/addExpense")}
        />
        <div className="p-my-4">
          {selectedCategories.map((category) => (
            <FilterChip
              key={category.id}
              label="Expense-Category"
              value={{
                name: category.name,
                id: category.id,
              }}
              removeFilter={removeFilter}
            />
          ))}
        </div>
        <DataTable
          stripedRows
          showGridlines
          value={expenses}
          data-testid="expenses-table"
          scrollable
          scrollHeight="56vh"
          footer={totalRow}
        >
          {getExpenseTableColumns()}
        </DataTable>
      </>
    );
  return <ProtectedContent pageContent={pageContent} />;
}
