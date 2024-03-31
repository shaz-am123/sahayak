import mongoose from "mongoose";
require("dotenv").config();

export class DatabaseConfiguration {
  private static instance: DatabaseConfiguration;
  private databaseUrl: string;
  private isConnected: boolean = false;

  private constructor(databaseUrl: string) {
    this.databaseUrl = databaseUrl;
  }

  private async initialize() {
    if (!this.isConnected) {
      await this.connect();
      this.isConnected = true;
    }
  }

  public async destructor() {
    if (this.isConnected) {
      await this.disconnect();
      this.isConnected = false;
    }
  }

  public static async getInstance(
    databaseUrl: string = process.env.DB_URL!
  ): Promise<DatabaseConfiguration> {
    if (!DatabaseConfiguration.instance) {
      const instance = new DatabaseConfiguration(databaseUrl);
      await instance.initialize();
      DatabaseConfiguration.instance = instance;
    }
    return DatabaseConfiguration.instance;
  }

  private async connect() {
    try {
      mongoose.connect(this.databaseUrl)
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw error;
    }
  }

  private async disconnect() {
    try {
      mongoose.disconnect();
      console.log("Disconnected from MongoDB");
    } catch (error) {
      console.error("Error disconnecting from MongoDB:", error);
      throw error;
    }
  }
}
