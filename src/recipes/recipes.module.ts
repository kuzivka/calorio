import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { Product } from './product.entity';
import { Recipe } from './recipe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe, Product])],
  providers: [RecipesService],
  controllers: [RecipesController],
})
export class RecipeModule {}
