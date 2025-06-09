export type PersonUniqueIdentifiers = {
  emails: string[];
  nationalIds: string[];
  fullNameAndBirth: Array<{
    firstName: string;
    lastName: string;
    birthDate?: string;
  }>;
};
