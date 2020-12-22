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
import { SECRET_KEY } from './constants';
import { RecipesService } from './recipes.service';
import { RecipeDTO } from './recipie.dto';

@Controller()
export class RecipesController {
  @Inject(RecipesService)
  private recipesService: RecipesService;

  @Get()
  async showListOfRecipes(
    @Res() res: Response,
    @Query('onlyVegeterian') onlyVegeterian: string,
    @Query('error') error: string,
  ) {
    const recipes = (await this.recipesService.getAllRecipies()).filter((r) => {
      return !onlyVegeterian || r.vegeterian == Boolean(onlyVegeterian);
    });
    const recipesWithFormattedProducts = recipes.map((recipe) => {
      return {
        ...recipe,
        products: recipe.products.map((p) => p.name).join(', '),
      };
    });
    return res.render('index.hbs', {
      recipes: recipesWithFormattedProducts,
      vegeterian: Boolean(onlyVegeterian),
      error,
    });
  }

  @Get('delete-recipe')
  async deleteRecipe(
    @Res() res: Response,
    @Query('recipeId') recipeId: string | number,
    @Query('secretKey') secretKey: string,
  ) {
    if (secretKey === SECRET_KEY) {
      await this.recipesService.deleteRecipe(recipeId);
      return res.redirect('/');
    } else {
      return res.redirect('/?error=incorrect+secret+key');
    }
  }

  @Get('/add-recipe')
  async renderAddRecipeForm(
    @Res() res: Response,
    @Query('error') error: string,
  ) {
    const products = await this.recipesService.getAllProducts();
    return res.render('add-recipe.hbs', {
      products: products,
      error,
    });
  }

  @Post('/add-recipe')
  async createNewRecipe(
    @Res() res: Response,
    @Body() body: RecipeDTO & { secretKey: string },
  ) {
    const { secretKey, ...entity } = body;

    if (secretKey === SECRET_KEY) {
      await this.recipesService.createNewRecipe(entity);
      return res.redirect('/');
    } else {
      res.redirect('/add-recipe?error=incorrect+secretKey');
    }
  }

  @Get('/edit-recipe')
  async renderEditRecipeForm(
    @Res() res: Response,
    @Query('recipeId') recipeName: string,
    @Query('error') error: string,
  ) {
    const allProducts = await this.recipesService.getAllProducts();
    const recipe = await this.recipesService.getRecipeById(recipeName);
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
      error,
    });
  }

  @Post('/edit-recipe')
  async editRecipe(
    @Res() res: Response,
    @Body() body: RecipeDTO & { id: number; secretKey: string },
  ) {
    const { secretKey, ...dto } = body;
    if (secretKey === SECRET_KEY) {
      await this.recipesService.updateRecipe(dto);
      res.redirect('/');
    } else {
      res.redirect(`/edit-recipe?recipeId=${dto.id}&error=incorrect+secretKey`);
    }
  }
}
