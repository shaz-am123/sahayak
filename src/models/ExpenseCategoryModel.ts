import mongoose, { Schema, Document } from "mongoose";

interface IExpenseCategory extends Document {
  id: string;
  name: string;
  description: string;
  userId: string;
  expenseCount: number;
}

const ExpenseCategorySchema: Schema = new Schema({
  id: { type: String, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  expenseCount: { type: Number, required: true}
});

ExpenseCategorySchema.index({ userId: 1, name: 1 }, { unique: true });

const counterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model("Category-Counter", counterSchema);

ExpenseCategorySchema.pre<IExpenseCategory>("save", async function (next) {
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

const ExpenseCategoryModel = mongoose.model<IExpenseCategory>(
  "expense-category",
  ExpenseCategorySchema,
);
export default ExpenseCategoryModel;
