export const EntityType = {
  Home: 'House',
  Profile: 'Profile',
} as const;

export type EntityType = (typeof EntityType)[keyof typeof EntityType];
