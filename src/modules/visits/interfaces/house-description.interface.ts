import { FurnitureCondition } from '../enums/furniture-condition.enum';

export interface HouseDescription {
  notes?: string;
  furnitureCondition?: FurnitureCondition;
  kitchen?: string;
  bathroom?: string;
  numberOfRooms?: number;
}
