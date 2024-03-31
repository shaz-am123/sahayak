import { DatabaseConnection } from "../db";

export class CategoryRepository {
  private static instance: CategoryRepository;

  private constructor(databaseConnection: DatabaseConnection) {
    databaseConnection.connect();
  }

  public static getInstance(
    databaseConnection: DatabaseConnection = DatabaseConnection.getInstance()
  ): CategoryRepository {
    if (!CategoryRepository.instance) {
      CategoryRepository.instance = new CategoryRepository(databaseConnection);
    }
    return CategoryRepository.instance;
  }
}
