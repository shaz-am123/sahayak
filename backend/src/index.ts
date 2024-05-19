import express from "express";
import userRoutes from "./routes/category";
import authRoutes from "./routes/auth";
import expenseRoutes from "./routes/expense";
import { DatabaseConfiguration } from "./db";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const corsOptions = {
  origin: process.env.FRONTEND_SERVICE_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

DatabaseConfiguration.getInstance();

app.use("/auth", authRoutes);
app.use("/categories", userRoutes);
app.use("/expenses", expenseRoutes);

const PORT = process.env.PORT;
app.get("/", (req, res) => {
  res.send("<h1>Sahayak Backend</h1>");
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
