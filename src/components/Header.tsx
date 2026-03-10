import { Moon, Sun, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

interface HeaderProps {
  onExportCSV: () => void;
  onExportPDF: () => void;
  totalFiltered: number;
  totalJobs: number;
}

export function Header({ onExportCSV, onExportPDF, totalFiltered, totalJobs }: HeaderProps) {
  const { isDark, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="container">
        <div className="flex min-h-[4.25rem] items-center justify-between gap-3 rounded-[2rem] border border-border/85 bg-card/92 px-4 py-3 shadow-[0_16px_34px_hsl(var(--foreground)/0.07)] backdrop-blur md:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[1rem] bg-primary text-sm font-bold text-primary-foreground">
              JF
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold tracking-tight sm:text-xl">
                Job Finder
              </h1>
              <p className="truncate text-xs text-muted-foreground">
                {totalFiltered} of {totalJobs} roles shown
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <Button variant="outline" size="sm" className="h-10 px-3.5" onClick={onExportCSV}>
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </Button>
            <Button variant="outline" size="sm" className="h-10 px-3.5" onClick={onExportPDF}>
              <FileText className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export PDF</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggle}
              aria-label="Toggle dark mode"
              className="h-10 min-w-[6.5rem] px-3.5"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span>{isDark ? "Light" : "Dark"}</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
