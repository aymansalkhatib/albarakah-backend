import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DropdownCategory } from './entities/dropdown-category.entity';
import { Dropdown } from './entities/dropdown.entity';
import { DropdownOption } from './entities/dropdown-option.entity';
import { DropdownSelection } from './entities/dropdown-selection.entity';
import { DropdownCategoryRepository } from './repositories/dropdown-category.repository';
import { DropdownRepository } from './repositories/dropdown.repository';
import { DropdownOptionRepository } from './repositories/dropdown-option.repository';
import { DropdownSelectionRepository } from './repositories/dropdown-selection.repository';
import { DropdownCategoryService } from './services/dropdown-category.service';
import { DropdownService } from './services/dropdown.service';
import { DropdownOptionService } from './services/dropdown-option.service';
import { DropdownSelectionService } from './services/dropdown-selection.service';
import { DropdownCategoryController } from './controllers/dropdown-category.controller';
import { DropdownController } from './controllers/dropdown.controller';
import { DropdownOptionController } from './controllers/dropdown-option.controller';
import { DropdownSelectionController } from './controllers/dropdown-selection.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DropdownCategory,
      Dropdown,
      DropdownOption,
      DropdownSelection,
    ]),
  ],
  providers: [
    DropdownCategoryRepository,
    DropdownRepository,
    DropdownOptionRepository,
    DropdownSelectionRepository,
    DropdownCategoryService,
    DropdownService,
    DropdownOptionService,
    DropdownSelectionService,
  ],
  controllers: [
    DropdownCategoryController,
    DropdownController,
    DropdownOptionController,
    DropdownSelectionController,
  ],
  exports: [
    DropdownCategoryService,
    DropdownService,
    DropdownOptionService,
    DropdownSelectionService,
  ],
})
export class DropdownsModule {}