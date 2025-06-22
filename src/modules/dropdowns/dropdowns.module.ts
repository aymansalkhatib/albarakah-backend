import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DropdownCategory } from './entities/dropdown-category.entity';
import { Dropdown } from './entities/dropdown.entity';
import { DropdownOption } from './entities/dropdown-option.entity';
import { DropdownCategoryService } from './services/dropdown-category.service';
import { DropdownCategoryController } from './controllers/dropdown-category.controller';
import { DropdownService } from './services/dropdown.service';
import { DropdownController } from './controllers/dropdown.controller';
import { DropdownOptionService } from './services/dropdown-option.service';
import { SelectedDropdownOption } from './entities/selected-dropdown-option.entity';
import { SelectedDropdownOptionService } from './services/selected-dropdown-option.service';
import { SelectedDropdownOptionController } from './controllers/selected-dropdown-option.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([DropdownCategory, Dropdown, DropdownOption, SelectedDropdownOption]),
  ],
  providers: [
    DropdownCategoryService,
    DropdownService,
    DropdownOptionService,
    SelectedDropdownOptionService,
  ],
  controllers: [DropdownCategoryController, DropdownController, SelectedDropdownOptionController],
})
export class DropdownsModule {}
