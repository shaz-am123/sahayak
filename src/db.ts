import mongoose from "mongoose";
require("dotenv").config();

export class DatabaseConfiguration {
  private static instance: DatabaseConfiguration;
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
  ): DatabaseConfiguration {
    if (!DatabaseConfiguration.instance) {
      DatabaseConfiguration.instance = new DatabaseConfiguration(databaseUrl);
    }
    return DatabaseConfiguration.instance;
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
