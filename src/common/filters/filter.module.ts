import { Module } from '@nestjs/common';
import { FilterParserService } from './filter-parser.service';
import { QueryBuilderService } from './query-builder.service';
import { GenericFilterService } from './generic-filter.service';

@Module({
  providers: [FilterParserService, QueryBuilderService, GenericFilterService],
  exports: [FilterParserService, QueryBuilderService, GenericFilterService],
})
export class FilterModule {}
