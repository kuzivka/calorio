import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class RecipesController {
  @Get()
  getAllRecipes(@Res() res: Response): void {
    return res.render('index.hbs', {
      message: 'Hello my first nest application.',
    });
  }
}
