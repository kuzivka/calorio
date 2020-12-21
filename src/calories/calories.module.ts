import { Module } from '@nestjs/common';
import { CaloriesService } from './calories.service';
import { CaloriesController } from './calories.controller';

@Module({
  imports: [],
  providers: [CaloriesService],
  controllers: [CaloriesController],
})
export class CaloriesModule {}
