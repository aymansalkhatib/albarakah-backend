import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DEFAULT_FILE_VALIDATION_OPTIONS } from '../../shared/modules/app-storage/constants/file-validation.constants.ts';
import { STORAGE_CONSTANTS } from '../../shared/modules/app-storage/constants/storage.constants';
import { FileValidationOptions } from '../../shared/modules/app-storage/types';
import { DropdownsModule } from '../dropdowns/dropdowns.module';
import { PersonController } from './controllers/person.controller';
import { Person } from './entities/person.entity';
import { PersonsService } from './services/persons.service';

@Module({
  imports: [DropdownsModule, TypeOrmModule.forFeature([Person])],
  controllers: [PersonController],
  providers: [
    {
      provide: STORAGE_CONSTANTS.FILE_VALIDATION_CONFIG,
      useValue: {
        ...DEFAULT_FILE_VALIDATION_OPTIONS,
        isFileRequired: false,
        globalMaxFileSize: '2MB',
      } as FileValidationOptions,
    },

    PersonsService,
  ],
  exports: [PersonsService],
})
export class PersonsModule {}
