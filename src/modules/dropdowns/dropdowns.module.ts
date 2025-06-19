import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DropdownCategory } from './entities/dropdown-category.entity';
import { Dropdown } from './entities/dropdown.entity';
import { DropdownOption } from './entities/dropdown-option.entity';
import { DropdownSelection } from './entities/dropdown-selection.entity';
import { DropdownCategoryService } from './services/dropdown-category.service';
import { DropdownCategoryController } from './controllers/dropdown-category.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([DropdownCategory, Dropdown, DropdownOption, DropdownSelection]),
  ],
  providers: [DropdownCategoryService],
  controllers: [DropdownCategoryController],
})
export class DropdownsModule {}
