
export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface NewCategory {
  name: string;
  slug: string;
}

export type CategoryUpdate = Partial<NewCategory>;
