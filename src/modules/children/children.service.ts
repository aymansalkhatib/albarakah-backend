import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Child } from './entities/children.entity';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';

@Injectable()
export class ChildrenService {
  constructor(
    @InjectRepository(Child)
    private readonly childrenRepository: Repository<Child>,
  ) {}

  async create(createChildDto: CreateChildDto): Promise<Child> {
    const child = this.childrenRepository.create(createChildDto);
    return await this.childrenRepository.save(child);
  }

  async findAll(): Promise<Child[]> {
    return await this.childrenRepository.find({
      relations: ['person', 'familyMember', 'family'],
    });
  }

  async findOne(id: number): Promise<Child> {
    const child = await this.childrenRepository.findOne({
      where: { id },
      relations: ['person', 'familyMember', 'family'],
    });

    if (!child) {
      throw new NotFoundException(`الطفل برقم ${id} غير موجود`);
    }

    return child;
  }

  async update(id: number, updateChildDto: UpdateChildDto): Promise<Child> {
    const child = await this.findOne(id);
    Object.assign(child, updateChildDto);
    return await this.childrenRepository.save(child);
  }

  async remove(id: number): Promise<void> {
    const child = await this.findOne(id);
    await this.childrenRepository.softRemove(child);
  }

  async findByFamilyId(familyId: number): Promise<Child[]> {
    return await this.childrenRepository.find({
      where: { familyId },
      relations: ['person', 'familyMember', 'family'],
    });
  }

  async findByPersonId(personId: number): Promise<Child> {
    const child = await this.childrenRepository.findOne({
      where: { personId },
      relations: ['person', 'familyMember', 'family'],
    });

    if (!child) {
      throw new NotFoundException(`الطفل برقم الشخص ${personId} غير موجود`);
    }

    return child;
  }
}
