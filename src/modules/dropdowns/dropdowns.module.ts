import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DropdownCategory } from './entities/dropdown-category.entity';
import { Dropdown } from './entities/dropdown.entity';
import { DropdownOption } from './entities/dropdown-option.entity';
import { DropdownSelection } from './entities/dropdown-selection.entity';
import { DropdownCategoryService } from './services/dropdown-category.service';
import { DropdownCategoryController } from './controllers/dropdown-category.controller';
import { DropdownService } from './services/dropdown.service';
import { DropdownController } from './controllers/dropdown.controller';
import { DropdownOptionService } from './services/dropdown-option.service';
import { DropdownOptionController } from './controllers/dropdown-option.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([DropdownCategory, Dropdown, DropdownOption, DropdownSelection]),
  ],
  providers: [DropdownCategoryService, DropdownService, DropdownOptionService],
  controllers: [DropdownCategoryController, DropdownController, DropdownOptionController],
})
export class DropdownsModule {}
