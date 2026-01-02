
export interface Participant {
  id: string;
  name: string;
}

export type ViewType = 'input' | 'lucky-draw' | 'grouping';

export interface Group {
  id: number;
  name: string;
  members: Participant[];
}
