import { useQuery } from "@tanstack/react-query";
import type { Job } from "@/types/job";

const API_URL = "https://jsonfakery.com/jobs/paginated";

async function fetchAllJobs(): Promise<Job[]> {
  const allJobs: Job[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const res = await fetch(`${API_URL}?page=${page}`);
    if (!res.ok) throw new Error("Failed to fetch jobs");
    const data = await res.json();

    const jobs: Job[] = data.data ?? data;
    if (!Array.isArray(jobs) || jobs.length === 0) {
      hasMore = false;
    } else {
      allJobs.push(...jobs);
      if (jobs.length < 10) {
        hasMore = false;
      } else {
        page++;
      }
    }
    if (page > 20) hasMore = false;
  }

  return allJobs;
}

export function useJobs() {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: fetchAllJobs,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
