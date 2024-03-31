import mongoose from "mongoose";
require("dotenv").config();

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private databaseUrl: string;

  private constructor(databaseUrl: string) {
    this.databaseUrl = databaseUrl;
    this.connect();
  }

  public async destructor() {
    this.disconnect();
  }

  public static getInstance(
    databaseUrl: string = process.env.DB_URL!
  ): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection(databaseUrl);
    }
    return DatabaseConnection.instance;
  }

  private async connect() {
    try {
      mongoose.connect(this.databaseUrl).then(() => {
        console.log("Connected to MongoDB");
      });
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw error;
    }
  }

  private async disconnect() {
    try {
      mongoose.disconnect().then(() => {
        console.log("Disconnected from MongoDB");
      });
    } catch (error) {
      console.error("Error disconnecting from MongoDB:", error);
      throw error;
    }
  }
}
