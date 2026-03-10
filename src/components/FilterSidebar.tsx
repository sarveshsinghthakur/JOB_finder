import { Search, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import type { JobFilters } from "@/types/job";
import { DEFAULT_FILTERS } from "@/lib/filter-jobs";
import { useState } from "react";
import { cn } from "@/lib/utils";

const EMPLOYMENT_TYPES = ["Full-Time", "Part-Time", "Contract", "Internship"];

interface Props {
  filters: JobFilters;
  onChange: (filters: JobFilters) => void;
  locations: string[];
  categories: string[];
  salaryBounds: [number, number];
  searchValue: string;
  onSearchChange: (val: string) => void;
}

export function FilterSidebar({
  filters,
  onChange,
  locations,
  categories,
  salaryBounds,
  searchValue,
  onSearchChange,
}: Props) {
  const [open, setOpen] = useState(false);

  const update = (partial: Partial<JobFilters>) => {
    onChange({ ...filters, ...partial });
  };

  const toggleEmploymentType = (type: string) => {
    const types = filters.employmentTypes.includes(type)
      ? filters.employmentTypes.filter((t) => t !== type)
      : [...filters.employmentTypes, type];
    update({ employmentTypes: types });
  };

  const content = (
    <div className="space-y-5">
      <div className="relative">
        <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search title, company, or skills"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <Separator className="bg-border/80" />

      <div className="space-y-2">
        <Label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Location
        </Label>
        <Select
          value={filters.location}
          onValueChange={(v) => update({ location: v === "__all__" ? "" : v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="All locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All locations</SelectItem>
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Employment Type
        </Label>
        <div className="space-y-2">
          {EMPLOYMENT_TYPES.map((type) => (
            <label
              key={type}
              className="flex cursor-pointer items-center gap-2 rounded-[1rem] px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-accent/70"
            >
              <Checkbox
                checked={filters.employmentTypes.includes(type)}
                onCheckedChange={() => toggleEmploymentType(type)}
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Job Category
        </Label>
        <Select
          value={filters.jobCategory}
          onValueChange={(v) => update({ jobCategory: v === "__all__" ? "" : v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between rounded-[1.2rem] border border-border/70 bg-muted/55 px-3.5 py-2.5">
        <Label className="text-sm font-medium">Remote only</Label>
        <Switch
          checked={filters.remoteOnly}
          onCheckedChange={(v) => update({ remoteOnly: v })}
        />
      </div>

      <Separator className="bg-border/80" />

      <div className="space-y-3">
        <Label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Salary Range
        </Label>
        <Slider
          min={salaryBounds[0]}
          max={salaryBounds[1]}
          step={5000}
          value={filters.salaryRange}
          onValueChange={(v) => update({ salaryRange: v as [number, number] })}
        />
        <div className="flex justify-between text-xs font-medium text-muted-foreground">
          <span>${filters.salaryRange[0].toLocaleString()}</span>
          <span>${filters.salaryRange[1].toLocaleString()}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Created Within
        </Label>
        <Select
          value={filters.createdWithin}
          onValueChange={(v) => update({ createdWithin: v })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => onChange({ ...DEFAULT_FILTERS, salaryRange: salaryBounds })}
      >
        <X className="h-3.5 w-3.5" />
        <span>Clear all filters</span>
      </Button>
    </div>
  );

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="mb-4 h-10 rounded-[1.1rem] lg:hidden"
        onClick={() => setOpen((v) => !v)}
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        <span>Filters</span>
      </Button>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-foreground/18 backdrop-blur-sm lg:hidden",
          open ? "block" : "hidden",
        )}
        onClick={() => setOpen(false)}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-3 right-3 top-[5.5rem] z-50 h-[calc(100vh-6.25rem)] overflow-y-auto rounded-[2rem] border border-border/85 bg-card/95 p-5 shadow-[0_24px_48px_hsl(var(--foreground)/0.2)] transition-transform lg:static lg:inset-auto lg:h-auto lg:w-full lg:translate-x-0 lg:rounded-[2rem] lg:shadow-[0_14px_34px_hsl(var(--foreground)/0.07)]",
          open ? "translate-x-0" : "-translate-x-[110%]",
        )}
      >
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <span className="font-semibold">Filters</span>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        {content}
      </aside>
    </>
  );
}
