import type { Job } from "@/types/job";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Building2,
  DollarSign,
  Calendar,
  Briefcase,
  Wifi,
  Mail,
} from "lucide-react";

interface Props {
  job: Job;
}

export function JobCard({ job }: Props) {
  let qualifications: string[] = [];
  try {
    qualifications = JSON.parse(job.qualifications);
  } catch {
    if (job.qualifications) qualifications = [job.qualifications];
  }

  return (
    <Card className="group flex h-full flex-col overflow-hidden border-border/80 bg-card/92 transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_18px_36px_hsl(var(--foreground)/0.1)]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-[1.02rem] leading-snug">{job.title}</CardTitle>
          {job.is_remote_work === 1 && (
            <Badge variant="secondary" className="shrink-0 gap-1 border border-border/70 text-xs">
              <Wifi className="h-3 w-3" />
              <span>Remote</span>
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Building2 className="h-3.5 w-3.5" />
          <span>{job.company}</span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3.5 text-sm">
        <p className="line-clamp-3 leading-relaxed text-muted-foreground">{job.description}</p>

        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline" className="gap-1 border-border/75 bg-background/70 text-xs">
            <MapPin className="h-3 w-3" />
            <span>{job.location}</span>
          </Badge>
          <Badge variant="outline" className="gap-1 border-border/75 bg-background/70 text-xs">
            <Briefcase className="h-3 w-3" />
            <span>{job.employment_type}</span>
          </Badge>
          <Badge variant="outline" className="border-border/75 bg-background/70 text-xs">
            {job.job_category}
          </Badge>
        </div>

        <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
          <DollarSign className="h-4 w-4 text-primary" />
          <span>
            ${job.salary_from.toLocaleString()} - ${job.salary_to.toLocaleString()}
          </span>
        </div>

        {qualifications.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {qualifications.slice(0, 3).map((q, i) => (
              <span
                key={i}
                className="rounded-[0.95rem] border border-border/70 bg-muted/65 px-2.5 py-1 text-xs text-muted-foreground"
              >
                {q}
              </span>
            ))}
            {qualifications.length > 3 && (
              <span className="self-center text-xs text-muted-foreground">
                +{qualifications.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Deadline: {new Date(job.application_deadline).toLocaleDateString()}</span>
          </span>
          <span className="flex items-center gap-1">
            <Mail className="h-3 w-3" />
            <span className="truncate">{job.contact}</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
