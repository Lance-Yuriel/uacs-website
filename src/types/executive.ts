export interface Executive {
  id: string;
  name: string;
  position: string;
  title: string;
  isCoFounder?: boolean;
  bio: string;
  image: string;
  email: string;
  instagram?: string;
  linkedIn?: string;
  joinedYear: number;
  responsibilities: string[];
}

export interface ExecutiveData {
  executives: Executive[];
}
