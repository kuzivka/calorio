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

  private getProductsByNames(names: string[]): Promise<Product[]> {
    return Promise.all(
      names.map((name) => {
        return this.productsRepository.findOne({ name });
      }),
    );
  }

  async updateRecipe(newRecipe: RecipeDTO & { id: number }) {
    const normalizedProductNames =
      typeof newRecipe.products === 'string'
        ? [newRecipe.products]
        : newRecipe.products;
    const selectedProductsEntities = await this.getProductsByNames(
      normalizedProductNames,
    );
    const recipeEntity = await this.recipesRepository.findOne(newRecipe.id, {
      relations: ['products'],
    });
    recipeEntity.name = newRecipe.name;
    recipeEntity.description = newRecipe.description;
    recipeEntity.products = selectedProductsEntities;
    await this.recipesRepository.save(recipeEntity);
  }

  getRecipeById(recipeId: string | number): Promise<Recipe> {
    return this.recipesRepository.findOne(recipeId, {
      relations: ['products'],
    });
  }

  getAllRecipies(): Promise<Recipe[]> {
    return this.recipesRepository.find();
  }

  async createNewRecipe(recipe: RecipeDTO) {
    const { products: productNames, ...restRecipe } = recipe;
    const normalizedProductNames =
      typeof productNames === 'string' ? [productNames] : productNames;
    const products = await Promise.all(
      normalizedProductNames.map(async (productName) => {
        return this.productsRepository.findOne({ name: productName });
      }),
    );
    const newRecipe = this.recipesRepository.create({
      ...restRecipe,
      vegeterian: Boolean(restRecipe.vegeterian),
    });
    newRecipe.products = products;
    return this.recipesRepository.save(newRecipe);
  }

  deleteRecipe(id: string | number) {
    return this.recipesRepository.delete({ id: Number(id) });
  }

  async remove(id: number): Promise<void> {
    await this.recipesRepository.delete(id);
  }
}
