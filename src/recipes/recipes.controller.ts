import { Controller, Get } from '@nestjs/common';

@Controller()
export class RecipesController {
  @Get()
  getAllRecipes(): string {
    return 'This action returns all recipes';
  }
}
