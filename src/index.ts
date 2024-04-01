import express from "express";
import userRoutes from "./routes/category";
import authRoutes from "./routes/auth";
import { DatabaseConfiguration } from "./db";

const app = express();
app.use(express.json());

DatabaseConfiguration.getInstance();

app.use("/auth", authRoutes);
app.use("/categories", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
