export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary_from: number;
  salary_to: number;
  employment_type: string;
  application_deadline: string;
  qualifications: string;
  contact: string;
  job_category: string;
  is_remote_work: number;
  number_of_openings?: number;
  created_at?: string;
}

export interface JobFilters {
  search: string;
  location: string;
  employmentTypes: string[];
  jobCategory: string;
  remoteOnly: boolean;
  salaryRange: [number, number];
  createdWithin: string;
}

export type SortOption =
  | "newest"
  | "oldest"
  | "salary-high"
  | "salary-low"
  | "openings";

export type ViewMode = "pagination" | "infinite";
