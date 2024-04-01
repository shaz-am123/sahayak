import mongoose, { Schema, Document, CallbackError } from "mongoose";

interface ICategory extends Document {
  id: number;
  name: string;
  description: string;
  userId: string;
}

const CategorySchema: Schema = new Schema({
  id: { type: Number, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

CategorySchema.index({ userId: 1, name: 1 }, { unique: true });

const counterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

CategorySchema.pre<ICategory>("save", async function (next) {
  try {
    const counter = await Counter.findOneAndUpdate(
      { _id: "id" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    this["id"] = counter.seq;
    next();
  } catch (error: any) {
    next(error);
  }
});

const CategoryModel = mongoose.model<ICategory>("category", CategorySchema);
export default CategoryModel;
