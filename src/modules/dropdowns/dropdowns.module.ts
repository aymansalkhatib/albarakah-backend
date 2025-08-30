import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DropdownController } from './controllers/dropdown.controller';
import { DropdownOption } from './entities/dropdown-option.entity';
import { Dropdown } from './entities/dropdown.entity';
import { DropdownOptionService } from './services/dropdown-option.service';
import { DropdownService } from './services/dropdown.service';

@Module({
  imports: [TypeOrmModule.forFeature([Dropdown, DropdownOption])],
  providers: [DropdownService, DropdownOptionService],
  controllers: [DropdownController],

  exports: [DropdownService, DropdownOptionService],
})
export class DropdownsModule {}
