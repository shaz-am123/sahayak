import express from "express";
import userRoutes from "./routes/category";
import authRoutes from "./routes/auth";

const app = express();
app.use(express.json());

app.use("/auth", authRoutes)
app.use("/categories", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
