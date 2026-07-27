import { Module } from '@nestjs/common';
import { IngredientController, ProductFormulationController } from './ingredient.controller';
import { IngredientService } from './ingredient.service';

@Module({
  controllers: [IngredientController, ProductFormulationController],
  providers: [IngredientService],
  exports: [IngredientService],
})
export class IngredientModule {}
