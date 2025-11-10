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
  joinedYear: number;
  responsibilities: string[];
  // Extended fields for expanded view
  introduction?: string;
  degree?: string;
  favouriteSkills?: string[]; // Max 3 skills
}

export interface ExecutiveData {
  executives: Executive[];
}
