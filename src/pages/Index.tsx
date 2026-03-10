import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useJobs } from "@/hooks/use-jobs";
import { useDebounce } from "@/hooks/use-debounce";
import {
  filterJobs,
  sortJobs,
  getUniqueValues,
  getSalaryBounds,
  DEFAULT_FILTERS,
} from "@/lib/filter-jobs";
import { exportCSV, exportPDF } from "@/lib/export";
import type { JobFilters, SortOption, ViewMode } from "@/types/job";

import { Header } from "@/components/Header";
import { FilterSidebar } from "@/components/FilterSidebar";
import { ActiveFilters } from "@/components/ActiveFilters";
import { SortBar } from "@/components/SortBar";
import { JobCard } from "@/components/JobCard";
import { PaginationControls } from "@/components/PaginationControls";
import { SkeletonGrid } from "@/components/JobCardSkeleton";

const ITEMS_PER_PAGE = 12;

const Index = () => {
  const { data: jobs = [], isLoading, error } = useJobs();

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const [filters, setFilters] = useState<JobFilters>({
    ...DEFAULT_FILTERS,
  });

  const activeFilters = useMemo(
    () => ({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch],
  );

  const [sort, setSort] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("pagination");
  const [page, setPage] = useState(1);
  const [infiniteCount, setInfiniteCount] = useState(ITEMS_PER_PAGE);

  const locations = useMemo(() => getUniqueValues(jobs, "location"), [jobs]);
  const categories = useMemo(() => getUniqueValues(jobs, "job_category"), [jobs]);
  const salaryBounds = useMemo(() => getSalaryBounds(jobs), [jobs]);

  useEffect(() => {
    if (jobs.length > 0) {
      setFilters((f) => ({
        ...f,
        salaryRange: salaryBounds,
      }));
    }
  }, [salaryBounds, jobs.length]);

  const filteredJobs = useMemo(
    () => filterJobs(jobs, activeFilters),
    [jobs, activeFilters],
  );

  const sortedJobs = useMemo(
    () => sortJobs(filteredJobs, sort),
    [filteredJobs, sort],
  );

  useEffect(() => {
    setPage(1);
    setInfiniteCount(ITEMS_PER_PAGE);
  }, [activeFilters, sort]);

  const totalPages = Math.ceil(sortedJobs.length / ITEMS_PER_PAGE);
  const displayedJobs =
    viewMode === "pagination"
      ? sortedJobs.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
      : sortedJobs.slice(0, infiniteCount);

  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (viewMode !== "infinite") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && infiniteCount < sortedJobs.length) {
          setInfiniteCount((c) => c + ITEMS_PER_PAGE);
        }
      },
      { rootMargin: "200px" },
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [viewMode, infiniteCount, sortedJobs.length]);

  const handleFilterChange = useCallback((f: JobFilters) => {
    setFilters(f);
  }, []);

  return (
    <div className="min-h-screen pb-10">
      <Header
        onExportCSV={() => exportCSV(sortedJobs)}
        onExportPDF={() => exportPDF(sortedJobs, activeFilters)}
        totalFiltered={sortedJobs.length}
        totalJobs={jobs.length}
      />

      <div className="container py-6 sm:py-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="hidden w-72 shrink-0 lg:block">
            <FilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              locations={locations}
              categories={categories}
              salaryBounds={salaryBounds}
              searchValue={searchInput}
              onSearchChange={setSearchInput}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="lg:hidden">
              <FilterSidebar
                filters={filters}
                onChange={handleFilterChange}
                locations={locations}
                categories={categories}
                salaryBounds={salaryBounds}
                searchValue={searchInput}
                onSearchChange={setSearchInput}
              />
            </div>

            <ActiveFilters
              filters={activeFilters}
              onChange={(f) => {
                setFilters(f);
                if (!f.search) setSearchInput("");
              }}
              salaryBounds={salaryBounds}
            />

            <SortBar
              sort={sort}
              onSortChange={setSort}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            {isLoading ? (
              <SkeletonGrid />
            ) : error ? (
              <div className="rounded-[1.8rem] border border-destructive/40 bg-destructive/10 p-6 text-center text-destructive">
                Failed to load jobs. Please try again later.
              </div>
            ) : sortedJobs.length === 0 ? (
              <div className="rounded-[1.8rem] border border-border/80 bg-card/80 p-10 text-center text-muted-foreground">
                No jobs match your filters. Try adjusting your criteria.
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {displayedJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>

                {viewMode === "pagination" ? (
                  <PaginationControls
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                ) : (
                  <div ref={sentinelRef} className="h-10" />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
