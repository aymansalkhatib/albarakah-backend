import { Body, Controller, Post } from '@nestjs/common';
import { SerializeResponse } from '../../../common/decorators/serialize-response.decorator';
import { CreateSelectedDropdownOptionDto } from '../dtos/selected-dropdown-option/create-selected-dropdown-option.dto';
import { ResponseSelectedDropdownOptionDto } from '../dtos/selected-dropdown-option/response-selected-dropdown-option.dto';
import { SelectedDropdownOptionService } from '../services/selected-dropdown-option.service';

@Controller('selected-dropdown-options')
export class SelectedDropdownOptionController {
  constructor(private readonly selectedDropdownOptionService: SelectedDropdownOptionService) {}

  @Post()
  @SerializeResponse(ResponseSelectedDropdownOptionDto)
  create(
    @Body() createDto: CreateSelectedDropdownOptionDto,
  ): Promise<ResponseSelectedDropdownOptionDto> {
    return this.selectedDropdownOptionService.upsert(createDto);
  }
}
