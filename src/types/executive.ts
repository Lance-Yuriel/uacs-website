export interface Executive {
  id: string;
  name: string;
  position: string;
  foundingPosition: 'Co-Founder' | 'Founder';
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
