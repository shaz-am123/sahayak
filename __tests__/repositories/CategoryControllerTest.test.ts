import { DatabaseConfiguration } from "../../src/db";
import Category from "../../src/domain/Category";
import CategoryModel from "../../src/models/CategoryModel";
import { CategoryRepository } from "../../src/repositories/CategoryRepository";

describe("Category Repository Tests", () => {
  const databaseConfiguration = DatabaseConfiguration.getInstance(
    process.env.TESTING_DB_URL
  );
  const categoryRepository = CategoryRepository.getInstance();

  afterAll(async () => await databaseConfiguration.destructor());

  beforeEach(async () => {
    const categoryEntity = new CategoryModel({
      name: "Food",
      description: "Zomato, Swiggy, Eatsure",
      userId: "A001",
    });
    await categoryEntity.save();
  });

  afterEach(async () => {
    await CategoryModel.deleteMany({});
  });

  it("should be able to create a new category", async () => {
    const userId = "A001";
    const category = new Category({
      id: null,
      name: "Entertainment",
      description: "Movies, Netflix, Amazon Prime",
      userId: userId,
    });

    const actualResponse = await categoryRepository.createCategory(category);
    expect({ ...category, id: "ignore" }).toEqual({
      ...actualResponse,
      id: "ignore",
    });
  });

  it("should be able to handle errors while creating a new category with name", async () => {
    const userId = "A001";
    const category = new Category({
      id: null,
      name: "Food",
      description: "Zomato, Swiggy, Eatsure",
      userId: userId,
    });

    try {
      await categoryRepository.createCategory(category);
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(
        'E11000 duplicate key error collection: testing_sahayak.categories index: name_1 dup key: { name: "Food" }'
      );
    }
  });

  it("should be able to handle errors while creating new user with existing user name", async () => {
    const userId = "A001";
    const category = new Category({
      id: null,
      name: "Entertainment",
      description: "Movies, Netflix, Amazon Prime",
      userId: userId,
    });
    const databaseError = new Error("Database error");
    const saveCategoryMock = jest
      .spyOn(CategoryModel.prototype, "save")
      .mockImplementation(() => {
        throw databaseError;
      });

    try {
      await categoryRepository.createCategory(category);
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(databaseError.message);
    }
    saveCategoryMock.mockRestore();
  });
});
