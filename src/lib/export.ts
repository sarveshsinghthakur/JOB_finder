import type { Job, JobFilters } from "@/types/job";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportCSV(jobs: Job[]) {
  const headers = [
    "Title",
    "Company",
    "Location",
    "Salary From",
    "Salary To",
    "Employment Type",
    "Job Category",
    "Remote",
    "Openings",
    "Created At",
  ];

  const rows = jobs.map((j) => [
    j.title,
    j.company,
    j.location,
    j.salary_from,
    j.salary_to,
    j.employment_type,
    j.job_category,
    j.is_remote_work ? "Yes" : "No",
    j.number_of_openings ?? "N/A",
    j.created_at ?? "N/A",
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "job-results.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function exportPDF(jobs: Job[], filters: JobFilters) {
  const doc = new jsPDF({ orientation: "landscape" });

  doc.setFontSize(18);
  doc.text("Filtered Job Results", 14, 20);

  doc.setFontSize(10);
  const activeFilters: string[] = [];
  if (filters.search) activeFilters.push(`Search: "${filters.search}"`);
  if (filters.location) activeFilters.push(`Location: ${filters.location}`);
  if (filters.employmentTypes.length)
    activeFilters.push(`Type: ${filters.employmentTypes.join(", ")}`);
  if (filters.jobCategory)
    activeFilters.push(`Category: ${filters.jobCategory}`);
  if (filters.remoteOnly) activeFilters.push("Remote Only");
  if (filters.createdWithin !== "all")
    activeFilters.push(`Created Within: ${filters.createdWithin} days`);

  if (activeFilters.length > 0) {
    doc.text("Applied Filters:", 14, 30);
    doc.text(activeFilters.join(" | "), 14, 36);
  }

  autoTable(doc, {
    startY: activeFilters.length > 0 ? 42 : 30,
    head: [
      [
        "Title",
        "Company",
        "Location",
        "Salary",
        "Type",
        "Category",
        "Remote",
      ],
    ],
    body: jobs.map((j) => [
      j.title,
      j.company,
      j.location,
      `$${j.salary_from.toLocaleString()} - $${j.salary_to.toLocaleString()}`,
      j.employment_type,
      j.job_category,
      j.is_remote_work ? "Yes" : "No",
    ]),
    styles: { fontSize: 7 },
    headStyles: { fillColor: [30, 41, 59] },
  });

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Exported: ${new Date().toLocaleString()} | Total Results: ${jobs.length}`,
      14,
      doc.internal.pageSize.height - 10
    );
  }

  doc.save("job-results.pdf");
}
