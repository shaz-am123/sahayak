import Category from "../domain/Category";
import CategoryModel from "../models/CategoryModel";

export class CategoryRepository {
  private static instance: CategoryRepository;

  public static getInstance(): CategoryRepository {
    if (!CategoryRepository.instance) {
      CategoryRepository.instance = new CategoryRepository();
    }
    return CategoryRepository.instance;
  }

  async createCategory(category: Category): Promise<Category> {
    const categoryEntity = new CategoryModel({ ...category });
    await categoryEntity.save();
    return new Category({
      id: categoryEntity._id.toString(),
      name: categoryEntity.name,
      description: categoryEntity.description,
      userId: categoryEntity.userId,
    });
  }
}
