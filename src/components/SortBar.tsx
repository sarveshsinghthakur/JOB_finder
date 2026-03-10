import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { SortOption, ViewMode } from "@/types/job";

interface Props {
  sort: SortOption;
  onSortChange: (s: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (v: ViewMode) => void;
}

export function SortBar({ sort, onSortChange, viewMode, onViewModeChange }: Props) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-3 rounded-[1.7rem] border border-border/80 bg-card/85 p-3.5 shadow-[0_12px_30px_hsl(var(--foreground)/0.06)]">
      <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
        <SelectTrigger className="w-[232px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest first</SelectItem>
          <SelectItem value="oldest">Oldest first</SelectItem>
          <SelectItem value="salary-high">Salary high to low</SelectItem>
          <SelectItem value="salary-low">Salary low to high</SelectItem>
          <SelectItem value="openings">Most openings</SelectItem>
        </SelectContent>
      </Select>

      <div className="ml-auto flex items-center gap-2 rounded-[1.1rem] border border-border/70 bg-muted/55 px-3.5 py-2">
        <Label className="text-sm text-muted-foreground">Infinite scroll</Label>
        <Switch
          checked={viewMode === "infinite"}
          onCheckedChange={(v) => onViewModeChange(v ? "infinite" : "pagination")}
        />
      </div>
    </div>
  );
}
