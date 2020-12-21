import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { CaloriesDTO } from './calories.dto';

@Controller('/calories')
export class CaloriesController {
  @Get()
  calculateCalories(@Res() res: Response) {
    res.render('calories.hbs');
  }

  @Get('/calculate')
  getCalculatedCalories(@Res() res: Response, @Query() params: CaloriesDTO) {
    const { sex, weight, height, age, dishCount } = params;
    //calories
    const caloriesCoefficient = sex === 'man' ? 5 : -161;
    const caloriesAmount = Math.round(
      weight * 9.9 + height * 6.25 - age * 4.92 + caloriesCoefficient,
    );

    // Protein
    const proteins = Math.round((caloriesAmount * 0.3) / 4);
    const fats = Math.round((caloriesAmount * 0.3) / 9);
    const carbs = Math.round((caloriesAmount * 0.4) / 4);

    //water
    const water = weight * 33;

    //schedule
    const startHour = Number(params.firstDishTime.split(':')[0]);
    const endHour = Number(params.lastDishTime.split(':')[0]);
    const step = (endHour - startHour) / (dishCount - 1);
    const schedule = Array(Number(dishCount))
      .fill(0)
      .map((_, i) => i)
      .map((counter) => counter * step)
      .map((step) => step + startHour)
      .map(Math.round)
      .join(', ');

    debugger;

    res.render('diet.hbs', {
      calories: caloriesAmount,
      proteins,
      fats,
      carbs,
      water,
      schedule,
    });
  }
}
