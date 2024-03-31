import { DatabaseConnection } from "../db";
import Category from "../domain/Category";
import CategoryModel from "../models/CategoryModel";

export class CategoryRepository {
  private static instance: CategoryRepository;
  private databaseConnection: DatabaseConnection;

  private constructor(databaseConnection: DatabaseConnection) {
    this.databaseConnection = databaseConnection;
    databaseConnection.connect();
  }

  public async destructor() {
    await this.databaseConnection.disconnect();
  }

  public static getInstance(
    databaseConnection: DatabaseConnection = DatabaseConnection.getInstance()
  ): CategoryRepository {
    if (!CategoryRepository.instance) {
      CategoryRepository.instance = new CategoryRepository(databaseConnection);
    }
    return CategoryRepository.instance;
  }

  async createCategory(category: Category): Promise<Category> {
    const categoryEntity = new CategoryModel({...category});
    await categoryEntity.save();
    return new Category({
      id: categoryEntity._id.toString(),
      name: categoryEntity.name,
      description: categoryEntity.description,
      userId: categoryEntity.userId
    });
  }
}
