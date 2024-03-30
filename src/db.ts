import mongoose from "mongoose";
require("dotenv").config()

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private databaseUrl: string;

  private constructor(databaseUrl: string) {
    this.databaseUrl = databaseUrl;
  }

  public static getInstance(databaseUrl: string = process.env.DB_URL!): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection(databaseUrl);
    }
    return DatabaseConnection.instance;
  }

  async connect(): Promise<void> {
    try {
      await mongoose.connect(this.databaseUrl);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB");
    } catch (error) {
      console.error("Error disconnecting from MongoDB:", error);
      throw error;
    }
  }
}
