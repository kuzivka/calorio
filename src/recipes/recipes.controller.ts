import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { RecipesService } from './recipes.service';
import { RecipeDTO } from './recipie.dto';

@Controller()
export class RecipesController {
  @Inject(RecipesService)
  private recipesService: RecipesService;

  @Get()
  async showListOfRecipes(@Res() res: Response) {
    const recipes = await this.recipesService.getAllRecipies();
    return res.render('index.hbs', {
      recipes: recipes,
    });
  }

  @Get('delete-recipe')
  async deleteRecipe(
    @Query('recipeName') recipeName: string,
    @Res() res: Response,
  ) {
    console.log('Recipe name: ', recipeName);
    await this.recipesService.deleteRecipe(recipeName);
    return res.redirect('/');
  }

  @Get('/add-recipe')
  async renderAddRecipeForm(@Res() res: Response) {
    const products = await this.recipesService.getAllProducts();
    return res.render('add-recipe.hbs', {
      products: products,
    });
  }

  @Post('/add-recipe')
  async createNewRecipe(@Res() res: Response, @Body() body: RecipeDTO) {
    console.log('body: ', body);
    await this.recipesService.createNewRecipe(body);
    return res.redirect('/');
  }
}
