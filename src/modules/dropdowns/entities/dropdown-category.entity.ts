import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Dropdown } from './dropdown.entity';

@Entity('dropdown_category')
@Index('IDX_DROPDOWN_CATEGORY_PARENT_NAME', ['parentId', 'name'], { unique: true })
export class DropdownCategory extends BaseEntity {
  static readonly MAX_DEPTH = 3;

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'parent_id', nullable: true })
  parentId?: number;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'int', default: 1, nullable: false })
  depth: number;

  @Column({ type: 'boolean', default: true, name: 'is_subcategory_creation_enabled' })
  isSubcategoryCreationEnabled: boolean;

  @Column({ type: 'boolean', default: true, name: 'is_dropdown_creation_enabled' })
  isDropdownCreationEnabled: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  // Relationships

  @OneToMany(() => DropdownCategory, (category) => category.parent)
  children: DropdownCategory[];

  @ManyToOne(() => DropdownCategory, (category) => category.children, {
    nullable: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'parent_id' })
  parent?: DropdownCategory;

  @OneToMany(() => Dropdown, (dropdown) => dropdown.dropdownCategory)
  dropdowns: Dropdown[];

  @BeforeInsert()
  async setDepth() {
    if (this.parentId) {
      const parentCategory = await DropdownCategory.findOne({
        where: { id: this.parentId },
        relations: ['dropdowns'],
      });

      if (!parentCategory) {
        throw new Error(`Parent category with id ${this.parentId} not found.`);
      }

      if (parentCategory.dropdowns && parentCategory.dropdowns.length > 0) {
        throw new Error(
          `Cannot create subcategory: Parent category already has dropdown lists. Categories with dropdowns cannot have subcategories.`,
        );
      }

      if (!parentCategory.isSubcategoryCreationEnabled) {
        throw new Error(
          `Cannot create subcategory: Parent category does not allow subcategory creation.`,
        );
      }

      const newDepth = parentCategory.depth + 1;

      if (newDepth > DropdownCategory.MAX_DEPTH) {
        throw new Error(
          `Cannot create category: Maximum depth of ${DropdownCategory.MAX_DEPTH} levels exceeded. Parent category is at depth ${parentCategory.depth}.`,
        );
      }

      this.depth = newDepth;

      if (this.depth === DropdownCategory.MAX_DEPTH) {
        this.isSubcategoryCreationEnabled = false;
      }
    } else {
      this.depth = 1;
    }
  }

  async canCreateSubcategory(): Promise<boolean> {
    if (!this.isSubcategoryCreationEnabled) return false;

    if (this.depth >= DropdownCategory.MAX_DEPTH) return false;

    const categoryWithDropdowns = await DropdownCategory.findOne({
      where: { id: this.id },
      relations: ['dropdowns'],
    });

    return !(categoryWithDropdowns?.dropdowns && categoryWithDropdowns.dropdowns.length > 0);
  }

  async canAddDropdown(): Promise<boolean> {
    if (!this.isDropdownCreationEnabled) return false;

    const categoryWithChildren = await DropdownCategory.findOne({
      where: { id: this.id },
      relations: ['children'],
    });

    return !(categoryWithChildren?.children && categoryWithChildren.children.length > 0);
  }

  async updateEnableStates(): Promise<void> {
    const canCreateSub = await this.canCreateSubcategory();
    const canAddDrop = await this.canAddDropdown();
    this.isSubcategoryCreationEnabled = canCreateSub;
    this.isDropdownCreationEnabled = canAddDrop;
    await this.save();
  }
}
