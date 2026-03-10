import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import type { JobFilters } from "@/types/job";

interface Props {
  filters: JobFilters;
  onChange: (filters: JobFilters) => void;
  salaryBounds: [number, number];
}

export function ActiveFilters({ filters, onChange, salaryBounds }: Props) {
  const chips: { label: string; clear: () => void }[] = [];

  if (filters.search) {
    chips.push({
      label: `Search: "${filters.search}"`,
      clear: () => onChange({ ...filters, search: "" }),
    });
  }
  if (filters.location) {
    chips.push({
      label: `Location: ${filters.location}`,
      clear: () => onChange({ ...filters, location: "" }),
    });
  }
  filters.employmentTypes.forEach((t) => {
    chips.push({
      label: `Type: ${t}`,
      clear: () =>
        onChange({
          ...filters,
          employmentTypes: filters.employmentTypes.filter((x) => x !== t),
        }),
    });
  });
  if (filters.jobCategory) {
    chips.push({
      label: `Category: ${filters.jobCategory}`,
      clear: () => onChange({ ...filters, jobCategory: "" }),
    });
  }
  if (filters.remoteOnly) {
    chips.push({
      label: "Remote only",
      clear: () => onChange({ ...filters, remoteOnly: false }),
    });
  }
  if (
    filters.salaryRange[0] !== salaryBounds[0] ||
    filters.salaryRange[1] !== salaryBounds[1]
  ) {
    chips.push({
      label: `Salary: $${filters.salaryRange[0].toLocaleString()}-$${filters.salaryRange[1].toLocaleString()}`,
      clear: () => onChange({ ...filters, salaryRange: salaryBounds }),
    });
  }
  if (filters.createdWithin !== "all") {
    chips.push({
      label: `Within ${filters.createdWithin} days`,
      clear: () => onChange({ ...filters, createdWithin: "all" }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {chips.map((chip) => (
        <Badge
          key={chip.label}
          variant="outline"
          className="cursor-pointer gap-1 border-border/80 bg-card/80 pr-2 transition-colors hover:bg-accent"
          onClick={chip.clear}
        >
          {chip.label}
          <X className="h-3 w-3" />
        </Badge>
      ))}
    </div>
  );
}
