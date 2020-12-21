import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeModule } from './recipes/recipes.module';
import { CaloriesModule } from './calories/calories.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'angelina',
      password: 'angelinakuziv',
      database: 'project',
      entities: ['./**/*.entity.js'],
      synchronize: true,
      autoLoadEntities: true,
      cli: {
        migrationsDir: 'migration',
      },
    }),
    RecipeModule,
    CaloriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
