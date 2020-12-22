import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeModule } from './recipes/recipes.module';
import { CaloriesModule } from './calories/calories.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src/views/public/images'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
