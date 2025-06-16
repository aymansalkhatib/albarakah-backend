import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DropdownSelection } from '../entities/dropdown-selection.entity';

@Injectable()
export class DropdownSelectionRepository extends Repository<DropdownSelection> {
  constructor(private dataSource: DataSource) {
    super(DropdownSelection, dataSource.createEntityManager());
  }

  async findByRecord(recordId: number, recordType: string): Promise<DropdownSelection[]> {
    return this.createQueryBuilder('selection')
      .where('selection.recordId = :recordId', { recordId })
      .andWhere('selection.recordType = :recordType', { recordType })
      .leftJoinAndSelect('selection.dropdown', 'dropdown')
      .leftJoinAndSelect('selection.dropdownCategory', 'category')
      .leftJoinAndSelect('selection.selectedOption', 'option')
      .getMany();
  }

  async findByDropdown(dropdownId: number): Promise<DropdownSelection[]> {
    return this.createQueryBuilder('selection')
      .where('selection.dropdownId = :dropdownId', { dropdownId })
      .leftJoinAndSelect('selection.selectedOption', 'option')
      .getMany();
  }

  async deleteByRecord(recordId: number, recordType: string): Promise<void> {
    await this.createQueryBuilder()
      .delete()
      .from(DropdownSelection)
      .where('recordId = :recordId', { recordId })
      .andWhere('recordType = :recordType', { recordType })
      .execute();
  }
}