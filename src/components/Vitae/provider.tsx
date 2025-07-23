import { createContext } from 'react';
import DEFAULT_RESUME from '../../assets/default-resume.json';

export type ResumeSchemaBasic = {
  name: string;
  label: string;
  picture: string;
  email: string;
  phone: string;
  website: string;
  summary: string;
  location: {
    address: string;
    postalCode: string;
    city: string;
    countryCode: string;
    region: string;
  };
  profiles: Array<{
    network: string;
    username: string;
    url: string;
  }>;
};

export type ResumeSchemaWork = {
  company: string;
  icon?: string;
  position: string;
  website: string;
  startDate: string;
  endDate: string;
  summary: string;
  highlights: string[];
};

export type ResumeSchemaVolunteer = {
  organization: string;
  position: string;
  website?: string;
  startDate: string;
  endDate: string;
  summary: string;
  highlights: string[];
};

export type ResumeSchemaEducation = {
  institution: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate: string;
  gpa: string;
  courses: string[];
  minors: string[];
};

export type ResumeSchemaSkill = {
  name: string;
  level: string;
  keywords: string[];
};

export type ResumeSchemaLanguage = {
  language: string;
  fluency: string;
};

export type ResumeSchemaProject = {
  name: string;
  description: string;
  highlights: string[];
  keywords: any[];
  startDate: string;
  endDate: string;
  url: string;
  roles: any[];
  entity: string;
  type: string;
};

export type ResumeSchemaInterest = {
  name: string;
  keywords: string[];
};

export type ResumeSchemaContact = {
  key: string;
  icon: {
    type: string;
    value: string;
  };
  value: string;
  link: string;
};

export type ResumeSchemaCustom = {
  bio: string[];
  keywordTags: string[];
  contacts: ResumeSchemaContact[];
  affiliations: { title: string; entity: string; year: string }[];
};

export type ResumeSchemaAward = {
  title: string;
  entity: string;
  year: string;
  snippet: string;
};

export type ResumeSchemaPublication = {
  name: string;
  publisher: string;
  releaseDate: string;
  website: string;
  summary: string;
  authors: string[];
  doi?: string;
  isbn?: string;
  type: string; // e.g., "Article", "Book", "Conference Paper", etc.
  keywords: string[];
  url?: string;
};

export type ResumeSchemaReference = {
  name: string;
  reference: string;
  contact: {
    email?: string;
    phone?: string;
  };
  position?: string;
  company?: string;
};

export type ResumeSchemaFAQ = {
  category: string;
  question: string;
  answer: string;
};

export type ResumeSchema = {
  basic: ResumeSchemaBasic;
  work: ResumeSchemaWork[];
  volunteer: ResumeSchemaVolunteer[];
  education: ResumeSchemaEducation[];
  awards: ResumeSchemaAward[];
  publications: ResumeSchemaPublication[];
  skills: ResumeSchemaSkill[];
  languages: ResumeSchemaLanguage[];
  projects: ResumeSchemaProject[];
  interests: ResumeSchemaInterest[];
  references: ResumeSchemaReference[];
  custom: ResumeSchemaCustom;
  faq: ResumeSchemaFAQ[];
};

type ResumeContextProps = {
  resume: ResumeSchema;
  children?: React.ReactNode;
};

export const ResumeContext = createContext<ResumeContextProps>({
  resume: DEFAULT_RESUME as ResumeSchema,
  children: undefined,
});

export const ResumeProvider: React.FC<ResumeContextProps> = ({ resume, children }) => (
  <ResumeContext.Provider value={{ resume }}>{children}</ResumeContext.Provider>
);
