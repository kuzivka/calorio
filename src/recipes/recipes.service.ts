import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './recipe.entity';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private recipesRepository: Repository<Recipe>,
  ) {}

  findAll(): Promise<Recipe[]> {
    return this.recipesRepository.find();
  }

  // findVegeterianRecipes(): Promise<Recipe[]> {
  // .where("user.firstName = :firstName", { firstName })

  // return this.recipesRepository.find().where("recipe");
  // }

  async remove(id: number): Promise<void> {
    await this.recipesRepository.delete(id);
  }
}
