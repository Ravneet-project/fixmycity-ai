
import { useState } from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  Search,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Wrench,
  XCircle,
  Building2,
  Navigation,
  Phone,
} from "lucide-react";

import {
  getSavedReports,
  updateReportStatus,
} from "../utils/reportStorage";

import RoutingMap from "../components/RoutingMap";

const TrackComplaint = () => {
  const [complaintId, setComplaintId] =
    useState("");

  const [report, setReport] =
    useState(null);

  const [error, setError] =
    useState("");

  const findComplaint = () => {
    const id = complaintId
      .trim()
      .toUpperCase();

    if (!id) {
      setError(
        "Please enter a complaint ID."
      );

      setReport(null);

      return;
    }

    const reports =
      getSavedReports();

    const found =
      reports.find(
        (item) =>
          item.complaintId
            ?.toUpperCase() === id
      );

    if (!found) {
      setError(
        "No complaint found with this ID."
      );

      setReport(null);

      return;
    }

    setReport(found);

    setError("");
  };

  const handleStatusChange = (
    status
  ) => {
    if (!report?.complaintId) {
      return;
    }

    updateReportStatus(
      report.complaintId,
      status
    );

    const reports =
      getSavedReports();

    const updated =
      reports.find(
        (item) =>
          item.complaintId ===
          report.complaintId
      );

    if (!updated) {
      return;
    }

    const now =
      new Date().toISOString();

    const hasDepartment =
      Boolean(
        updated.assignedDepartment
      );

    const timeline = [
      {
        title:
          "Issue Reported",

        status:
          "completed",

        date:
          report.timeline?.[0]
            ?.date ||
          report.createdAt,
      },

      {
        title:
          "AI Verification",

        status:
          "completed",

        date:
          report.timeline?.[1]
            ?.date ||
          report.createdAt,
      },

      {
        title:
          "Department Assigned",

        status:
          hasDepartment
            ? "completed"
            : "pending",

        date:
          hasDepartment
            ? report.timeline?.[2]
                ?.date ||
              report.createdAt
            : null,
      },

      {
        title:
          "Work In Progress",

        status:
          status === "In Progress" ||
          status === "Resolved"
            ? "completed"
            : "pending",

        date:
          status === "In Progress" ||
          status === "Resolved"
            ? now
            : null,
      },

      {
        title:
          "Resolution",

        status:
          status === "Resolved"
            ? "completed"
            : "pending",

        date:
          status === "Resolved"
            ? now
            : null,
      },
    ];

    const finalUpdated = {
      ...updated,

      status,

      timeline,

      updatedAt:
        now,
    };

    const allReports =
      reports.map(
        (item) =>
          item.complaintId ===
          report.complaintId
            ? finalUpdated
            : item
      );

    localStorage.setItem(
      "fixmycity_reports",
      JSON.stringify(
        allReports
      )
    );

    window.dispatchEvent(
      new Event(
        "fixmycity-reports-updated"
      )
    );

    setReport(
      finalUpdated
    );
  };

  const getStatusIcon = () => {
    if (!report) {
      return null;
    }

    if (
      report.status ===
      "Resolved"
    ) {
      return (
        <CheckCircle2
          size={24}
        />
      );
    }

    if (
      report.status ===
      "In Progress"
    ) {
      return (
        <Wrench
          size={24}
        />
      );
    }

    return (
      <Clock3
        size={24}
      />
    );
  };

  return (
    <section
      id="track"
      className="track-section"
    >
      <div className="container">
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.7,
          }}
          className="track-heading"
        >
          <div className="section-badge">
            <Search
              size={16}
            />

            Complaint Tracking
          </div>

          <h2>
            Track Your
            <span>
              Civic Report.
            </span>
          </h2>

          <p>
            Enter your FixMyCity
            complaint ID to check
            its current status,
            GPS location, assigned
            civic department and
            resolution progress.
          </p>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
            delay: 0.1,
          }}
          className="track-search-card"
        >
          <div className="track-search-input">
            <Search
              size={20}
            />

            <input
              type="text"
              value={
                complaintId
              }
              onChange={(e) =>
                setComplaintId(
                  e.target.value.toUpperCase()
                )
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter"
                ) {
                  findComplaint();
                }
              }}
              placeholder="Enter complaint ID e.g. FMC-2026-123456"
            />
          </div>

          <button
            onClick={
              findComplaint
            }
            className="track-search-button"
          >
            Track Complaint
          </button>
        </motion.div>

        {error && (
          <div className="track-error">
            <XCircle
              size={16}
            />

            {error}
          </div>
        )}

        <AnimatePresence>
          {report && (
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 15,
              }}
              className="tracked-report"
            >
              <div className="tracked-report-top">
                <div>
                  <span className="tracking-label">
                    COMPLAINT FOUND
                  </span>

                  <h3>
                    {
                      report.title
                    }
                  </h3>

                  <div className="tracked-id">
                    {
                      report.complaintId
                    }
                  </div>
                </div>

                <div
                  className={`tracked-status ${report.status
                    .toLowerCase()
                    .replaceAll(
                      " ",
                      "-"
                    )}`}
                >
                  {
                    getStatusIcon()
                  }

                  <span>
                    {
                      report.status
                    }
                  </span>
                </div>
              </div>

              <div className="tracked-info-grid">
                <div>
                  <MapPin
                    size={16}
                  />

                  <span>
                    Location
                  </span>

                  <strong>
                    {
                      report.location
                    }
                  </strong>
                </div>

                <div>
                  <AlertTriangle
                    size={16}
                  />

                  <span>
                    Severity
                  </span>

                  <strong>
                    {
                      report.severity
                    }
                  </strong>
                </div>

                <div>
                  <ShieldCheck
                    size={16}
                  />

                  <span>
                    Priority
                  </span>

                  <strong>
                    {
                      report.priority
                    }
                  </strong>
                </div>

                <div>
                  <CheckCircle2
                    size={16}
                  />

                  <span>
                    AI Confidence
                  </span>

                  <strong>
                    {
                      report.confidence
                    }%
                  </strong>
                </div>
              </div>

              {report.coordinates && (
                <div className="tracking-location-panel">
                  <div className="tracking-location-title">
                    <Navigation
                      size={18}
                    />

                    <div>
                      <span>
                        GPS LOCATION
                      </span>

                      <strong>
                        Civic Issue
                        Coordinates
                      </strong>
                    </div>
                  </div>

                  <div className="tracking-coordinate-grid">
                    <div>
                      <span>
                        Latitude
                      </span>

                      <strong>
                        {Number(
                          report
                            .coordinates
                            .latitude
                        ).toFixed(
                          5
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Longitude
                      </span>

                      <strong>
                        {Number(
                          report
                            .coordinates
                            .longitude
                        ).toFixed(
                          5
                        )}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {report.assignedDepartment ? (
                <div className="tracking-department-panel">
                  <div className="tracking-department-icon">
                    <Building2
                      size={24}
                    />
                  </div>

                  <div className="tracking-department-content">
                    <span>
                      AUTO ASSIGNED
                      CIVIC DEPARTMENT
                    </span>

                    <h4>
                      {
                        report
                          .assignedDepartment
                          .name
                      }
                    </h4>

                    <div className="department-meta-row">
                      <div>
                        <Navigation
                          size={14}
                        />

                        <span>
                          {
                            report
                              .assignedDepartment
                              .distance
                          }{" "}
                          km away
                        </span>
                      </div>

                      <div>
                        <Phone
                          size={14}
                        />

                        <span>
                          {
                            report
                              .assignedDepartment
                              .contact
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="tracking-no-department">
                  <Building2
                    size={19}
                  />

                  <div>
                    <strong>
                      Department
                      assignment
                      pending
                    </strong>

                    <span>
                      This report
                      does not have
                      GPS-based civic
                      routing data.
                    </span>
                  </div>
                </div>
              )}

              {report.coordinates &&
                report.assignedDepartment && (
                  <RoutingMap
                    coordinates={
                      report.coordinates
                    }
                    department={
                      report.assignedDepartment
                    }
                  />
                )}

              <div className="tracked-main-grid">
                <div className="tracked-timeline-card">
                  <h4>
                    Resolution
                    Timeline
                  </h4>

                  <div className="tracked-timeline">
                    {(
                      report.timeline ||
                      []
                    ).map(
                      (
                        item,
                        index
                      ) => (
                        <div
                          key={
                            index
                          }
                          className={`tracked-timeline-item ${item.status}`}
                        >
                          <div className="tracked-timeline-marker">
                            {item.status ===
                            "completed" ? (
                              <CheckCircle2
                                size={
                                  16
                                }
                              />
                            ) : (
                              <Clock3
                                size={
                                  16
                                }
                              />
                            )}
                          </div>

                          <div>
                            <strong>
                              {
                                item.title
                              }
                            </strong>

                            <span>
                              {item.status ===
                              "completed"
                                ? "Completed"
                                : "Pending"}
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="admin-simulator">
                  <div className="admin-simulator-header">
                    <span>
                      DEMO MODE
                    </span>

                    <h4>
                      Authority Status
                      Simulator
                    </h4>

                    <p>
                      Simulate the
                      municipal workflow
                      and show how the
                      complaint progresses
                      from submission to
                      resolution.
                    </p>
                  </div>

                  <div className="admin-status-buttons">
                    <button
                      className={
                        report.status ===
                        "Reported"
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        handleStatusChange(
                          "Reported"
                        )
                      }
                    >
                      <Clock3
                        size={17}
                      />

                      <div>
                        <strong>
                          Reported
                        </strong>

                        <span>
                          Complaint received
                        </span>
                      </div>
                    </button>

                    <button
                      className={
                        report.status ===
                        "In Progress"
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        handleStatusChange(
                          "In Progress"
                        )
                      }
                    >
                      <Wrench
                        size={17}
                      />

                      <div>
                        <strong>
                          In Progress
                        </strong>

                        <span>
                          Civic team working
                        </span>
                      </div>
                    </button>

                    <button
                      className={
                        report.status ===
                        "Resolved"
                          ? "active resolved"
                          : ""
                      }
                      onClick={() =>
                        handleStatusChange(
                          "Resolved"
                        )
                      }
                    >
                      <CheckCircle2
                        size={17}
                      />

                      <div>
                        <strong>
                          Resolved
                        </strong>

                        <span>
                          Issue fixed
                        </span>
                      </div>
                    </button>
                  </div>

                  {report.image && (
                    <img
                      src={
                        report.image
                      }
                      alt={
                        report.title
                      }
                      className="admin-report-image"
                    />
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default TrackComplaint;