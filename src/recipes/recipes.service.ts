import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { Recipe } from './recipe.entity';
import { RecipeDTO } from './recipie.dto';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private recipesRepository: Repository<Recipe>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  getAllProducts(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  findAll(): Promise<Recipe[]> {
    return this.recipesRepository.find();
  }

  async createNewRecipe(recipe: RecipeDTO) {
    const { products: productNames } = recipe;
    const normalizedProductNames =
      typeof productNames === 'string' ? [productNames] : productNames;
    const products = await Promise.all(
      normalizedProductNames.map(async (productName) => {
        return this.productsRepository.findOne({ name: productName });
      }),
    );
    const newRecipe = this.recipesRepository.create({
      name: recipe.name,
      description: recipe.description,
    });
    newRecipe.products = products;
    return this.recipesRepository.save(newRecipe);
  }

  // findVegeterianRecipes(): Promise<Recipe[]> {
  // .where("user.firstName = :firstName", { firstName })

  // return this.recipesRepository.find().where("recipe");
  // }

  async remove(id: number): Promise<void> {
    await this.recipesRepository.delete(id);
  }
}
