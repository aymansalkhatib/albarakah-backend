import { House } from '@app/modules/houses/entities/house.entity';
import { Person } from '@app/modules/persons/entities/person.entity';

export const EntityType = {
  Profile: 'Person',
  Home: 'House',
} as const;

export type EntityType = (typeof EntityType)[keyof typeof EntityType];
