const expenseTableColumns = [
  {
    field: "expenseCategory.name",
    header: "Category",
    sort: false,
  },
  {
    field: "amount",
    header: "Amount(₹)",
    sort: true,
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

export default expenseTableColumns;
