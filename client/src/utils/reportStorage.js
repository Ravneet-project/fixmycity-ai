const STORAGE_KEY = "fixmycity_reports";

export const getSavedReports = () => {
  try {
    const reports = localStorage.getItem(STORAGE_KEY);

    return reports ? JSON.parse(reports) : [];
  } catch (error) {
    console.error("Unable to load reports:", error);
    return [];
  }
};

export const saveReport = (report) => {
  const oldReports = getSavedReports();

  const updatedReports = [
    report,
    ...oldReports,
  ];

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedReports)
  );

  window.dispatchEvent(
    new CustomEvent("fixmycity-report-added", {
      detail: report,
    })
  );

  return report;
};

export const generateComplaintId = () => {
  const year = new Date().getFullYear();

  const randomPart = Math.floor(
    100000 + Math.random() * 900000
  );

  return `FMC-${year}-${randomPart}`;
};

export const updateReportStatus = (
  complaintId,
  status
) => {
  const reports = getSavedReports();

  const updatedReports = reports.map(
    (report) =>
      report.complaintId === complaintId
        ? {
            ...report,
            status,
            updatedAt:
              new Date().toISOString(),
          }
        : report
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedReports)
  );

  window.dispatchEvent(
    new Event("fixmycity-reports-updated")
  );

  return updatedReports;
};