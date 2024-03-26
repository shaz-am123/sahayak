import express from "express";
import connectDB from "./db";
import userRoutes from "./routes/user";
import authRoutes from "./routes/auth";

const app = express();
app.use(express.json());

connectDB();

app.use("/auth", authRoutes)
app.use("/users", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
