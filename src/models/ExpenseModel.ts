import mongoose, { Schema, Document } from "mongoose";

interface IExpense extends Document {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  expenseCategoryId: string;
  description: string;
  date: Date;
}

const ExpenseSchema: Schema = new Schema({
  id: { type: String, unique: true },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  expenseCategoryId: { type: String, required: true },
  description: { type: String, required: false },
  date: { type: Date, required: true },
});

const counterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model("Expense-Counter", counterSchema);

ExpenseSchema.pre<IExpense>("save", async function (next) {
  try {
    const counter = await Counter.findOneAndUpdate(
      { _id: "id" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );

    this["id"] = counter.seq.toString();
    next();
  } catch (error: any) {
    next(error);
  }
});

const ExpenseModel = mongoose.model<IExpense>("expense", ExpenseSchema);
export default ExpenseModel;
