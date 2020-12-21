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
    await this.recipesService.createNewRecipe(body);
    return res.redirect('/');
  }

  @Get('/edit-recipe')
  async renderEditRecipeForm(
    @Res() res: Response,
    @Query('recipeName') recipeName: string,
  ) {
    const allProducts = await this.recipesService.getAllProducts();
    const recipe = await this.recipesService.getRecipeByName(recipeName);
    const recipesProductsName = recipe.products.map((p) => p.name);
    const products = allProducts.map((product) => {
      return {
        ...product,
        selected: recipesProductsName.includes(product.name),
      };
    });
    res.render('edit-recipe.hbs', {
      ...recipe,
      products,
    });
  }

  @Post('/edit-recipe')
  async editRecipe(
    @Res() res: Response,
    @Body() body: RecipeDTO & { id: number },
  ) {
    await this.recipesService.updateRecipe(body);
    res.redirect('/');
  }
}
