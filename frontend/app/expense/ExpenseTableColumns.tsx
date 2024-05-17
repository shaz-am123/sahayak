import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

const textEditor = (options) => {
  return (
    <InputTextarea
      autoResize
      rows={1}
      autoComplete="off"
      value={options.value}
      onChange={(e) => options.editorCallback(e.target.value)}
      style={{ width: "100%" }}
      data-testid="desc-editor"
    />
  );
};

const numberEditor = (options) => {
  return (
    <InputText
      keyfilter="pint"
      type="number"
      value={options.value}
      onChange={(e) => options.editorCallback(e.target.value)}
      data-testid="amount-editor"
    />
  );
};

const dateEditor = (options) => {
  return (
    <Calendar
      showIcon
      readOnlyInput
      value={new Date(options.value)}
      dateFormat="dd M, yy"
      data-testid="date-editor"
    />
  );
};

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
    editor: (options) => numberEditor(options),
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
    editor: (options) => dateEditor(options),
  },
  {
    field: "description",
    header: "Description",
    sort: false,
    editor: (options) => textEditor(options),
  },
];

export default expenseTableColumns;
