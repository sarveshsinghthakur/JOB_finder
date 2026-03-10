import type { Job, JobFilters, SortOption } from "@/types/job";

export function filterJobs(jobs: Job[], filters: JobFilters): Job[] {
  return jobs.filter((job) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matches =
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.description.toLowerCase().includes(q);
      if (!matches) return false;
    }

    if (filters.location && job.location !== filters.location) return false;

    if (
      filters.employmentTypes.length > 0 &&
      !filters.employmentTypes.includes(job.employment_type)
    )
      return false;

    if (filters.jobCategory && job.job_category !== filters.jobCategory)
      return false;

    if (filters.remoteOnly && job.is_remote_work !== 1) return false;

    if (job.salary_from < filters.salaryRange[0] || job.salary_to > filters.salaryRange[1])
      return false;

    if (filters.createdWithin !== "all" && job.created_at) {
      const days = parseInt(filters.createdWithin);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      if (new Date(job.created_at) < cutoff) return false;
    }

    return true;
  });
}

export function sortJobs(jobs: Job[], sort: SortOption): Job[] {
  const sorted = [...jobs];
  switch (sort) {
    case "newest":
      return sorted.sort(
        (a, b) =>
          new Date(b.created_at ?? 0).getTime() -
          new Date(a.created_at ?? 0).getTime()
      );
    case "oldest":
      return sorted.sort(
        (a, b) =>
          new Date(a.created_at ?? 0).getTime() -
          new Date(b.created_at ?? 0).getTime()
      );
    case "salary-high":
      return sorted.sort((a, b) => b.salary_to - a.salary_to);
    case "salary-low":
      return sorted.sort((a, b) => a.salary_from - b.salary_from);
    case "openings":
      return sorted.sort(
        (a, b) => (b.number_of_openings ?? 0) - (a.number_of_openings ?? 0)
      );
    default:
      return sorted;
  }
}

export function getUniqueValues(jobs: Job[], key: keyof Job): string[] {
  const set = new Set<string>();
  jobs.forEach((j) => {
    const val = j[key];
    if (val != null && val !== "") set.add(String(val));
  });
  return Array.from(set).sort();
}

export function getSalaryBounds(jobs: Job[]): [number, number] {
  if (jobs.length === 0) return [0, 300000];
  let min = Infinity;
  let max = -Infinity;
  jobs.forEach((j) => {
    if (j.salary_from < min) min = j.salary_from;
    if (j.salary_to > max) max = j.salary_to;
  });
  return [min, max];
}

export const DEFAULT_FILTERS: JobFilters = {
  search: "",
  location: "",
  employmentTypes: [],
  jobCategory: "",
  remoteOnly: false,
  salaryRange: [0, 300000],
  createdWithin: "all",
};
