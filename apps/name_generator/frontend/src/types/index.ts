export interface PersonNameResult {
  name: string;
  firstName: string;
  lastName: string;
  culture: string;
  gender: string;
  method: string;
  origin: string;
  meaning: string;
  pronunciation: string;
  period: string;
}

export interface PeopleParams {
  count: number;
  gender: string;
  culture: string;
  method: string;
  type: string;
  period: string;
  excludeReal: boolean;
}

export interface Option {
  value: string;
  label: string;
}
