import { Body, Controller, Get, Inject, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { RecipesService } from './recipes.service';
import { RecipeDTO } from './recipie.dto';

@Controller()
export class RecipesController {
  @Inject(RecipesService)
  private recipesService: RecipesService;

  @Get()
  showListOfRecipes(@Res() res: Response): void {
    return res.render('index.hbs', {
      message: 'Hello my first nest application.',
    });
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
