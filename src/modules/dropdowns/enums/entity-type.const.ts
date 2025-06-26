export const EntityType = {
  Home: 'House',
} as const;

export type EntityType = (typeof EntityType)[keyof typeof EntityType];
