
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import {
  MapPin,
  Clock3,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  Navigation,
} from "lucide-react";

import issues from "../data/issues";
import { getSavedReports } from "../utils/reportStorage";
import CityIssuesMap from "../components/CityIssuesMap";

const filters = [
  "All",
  "Road Damage",
  "Waste",
  "Street Light",
  "Water",
];

const ExploreIssues = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [userReports, setUserReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  const loadReports = () => {
    setUserReports(getSavedReports());
  };

  useEffect(() => {
    loadReports();

    window.addEventListener("fixmycity-report-added", loadReports);
    window.addEventListener("fixmycity-reports-updated", loadReports);

    return () => {
      window.removeEventListener("fixmycity-report-added", loadReports);
      window.removeEventListener("fixmycity-reports-updated", loadReports);
    };
  }, []);

  const allIssues = useMemo(() => {
    return [...userReports, ...issues];
  }, [userReports]);

  const filteredIssues = allIssues.filter((issue) => {
    const matchesFilter =
      activeFilter === "All" || issue.category === activeFilter;

    const query = search.toLowerCase().trim();

    const matchesSearch =
      !query ||
      issue.title?.toLowerCase().includes(query) ||
      issue.location?.toLowerCase().includes(query) ||
      issue.category?.toLowerCase().includes(query) ||
      issue.complaintId?.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  const getStatusClass = (status) => {
    return (status || "Reported")
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  const getSeverityClass = (severity) => {
    return (severity || "Medium").toLowerCase();
  };

  const getTimeline = (report) => {
    if (report.timeline && report.timeline.length > 0) {
      return report.timeline;
    }

    return [
      {
        title: "Issue Reported",
        status: "completed",
      },
      {
        title: "AI Verification",
        status: report.complaintId ? "completed" : "pending",
      },
      {
        title: "Department Review",
        status:
          report.status === "In Progress" || report.status === "Resolved"
            ? "completed"
            : "pending",
      },
      {
        title: "Resolution",
        status: report.status === "Resolved" ? "completed" : "pending",
      },
    ];
  };

  return (
    <section id="explore" className="explore-section">
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
          className="explore-heading"
        >
          <div className="section-badge">
            <Navigation size={16} />
            Live Civic Intelligence
          </div>

          <h2>
            Explore Issues
            <span>Around Your City</span>
          </h2>

          <p>
            Track civic problems in real time, view progress and see how your
            community is improving.
          </p>
        </motion.div>

        <div className="explore-toolbar">
          <div className="explore-search">
            <Search size={17} />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search issue, location or complaint ID..."
            />
          </div>

          <div className="filter-tabs">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={activeFilter === filter ? "active" : ""}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          <button type="button" className="filter-button">
            <Filter size={16} />
            Filters
          </button>
        </div>

        <div className="explore-grid">
          <div className="issue-list">
            {filteredIssues.length > 0 ? (
              filteredIssues.map((issue, index) => (
                <motion.article
                  key={issue.complaintId || issue.id}
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
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  whileHover={{
                    y: -6,
                  }}
                  className="issue-card-large"
                >
                  <div className="issue-image-wrap">
                    {issue.image ? (
                      <img src={issue.image} alt={issue.title} />
                    ) : (
                      <div className="issue-image-placeholder">
                        <MapPin size={34} />
                      </div>
                    )}

                    <span
                      className={
                        "severity-pill " +
                        getSeverityClass(issue.severity)
                      }
                    >
                      <AlertTriangle size={12} />
                      {issue.severity || "Medium"}
                    </span>
                  </div>

                  <div className="issue-card-body">
                    <div className="issue-meta-row">
                      <span className="issue-category">
                        {issue.category || "Civic Issue"}
                      </span>

                      <span
                        className={
                          "status-chip " +
                          getStatusClass(issue.status)
                        }
                      >
                        {issue.status === "Resolved" && (
                          <CheckCircle2 size={13} />
                        )}

                        {issue.status || "Reported"}
                      </span>
                    </div>

                    {issue.complaintId && (
                      <div className="complaint-mini-id">
                        {issue.complaintId}
                      </div>
                    )}

                    <h3>{issue.title || "Civic Issue Report"}</h3>

                    <div className="issue-location">
                      <MapPin size={14} />

                      {issue.location || "Location not specified"}
                    </div>

                    <div className="issue-card-footer">
                      <span>
                        <Clock3 size={13} />

                        {issue.time
                          ? issue.time
                          : issue.createdAt
                          ? new Date(issue.createdAt).toLocaleString()
                          : "Recently"}
                      </span>

                      <button
                        type="button"
                        onClick={() => setSelectedReport(issue)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))
            ) : (
              <div className="issues-empty-state">
                <Search size={30} />

                <h3>No issues found</h3>

                <p>
                  Try another category, location, issue name or complaint ID.
                </p>
              </div>
            )}
          </div>

          <motion.div
            initial={{
              opacity: 0,
              x: 35,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.7,
            }}
            className="city-map-panel"
          >
            <div className="map-topbar">
              <div>
                <span>LIVE MAP</span>
                <h3>City Issue Map</h3>
              </div>

              <div className="live-indicator">
                <i></i>
                Live
              </div>
            </div>

            <CityIssuesMap />

            <div className="map-stats">
              <div>
                <strong>
                  {
                    allIssues.filter(
                      (issue) => issue.status !== "Resolved"
                    ).length
                  }
                </strong>

                <span>Active Issues</span>
              </div>

              <div>
                <strong>
                  {
                    allIssues.filter(
                      (issue) => issue.status === "Resolved"
                    ).length
                  }
                </strong>

                <span>Resolved</span>
              </div>

              <div>
                <strong>{userReports.length}</strong>
                <span>Citizen Reports</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {selectedReport && (
        <div
          className="tracking-modal-backdrop"
          onClick={() => setSelectedReport(null)}
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.92,
              y: 30,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            className="tracking-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="tracking-close"
              onClick={() => setSelectedReport(null)}
            >
              ×
            </button>

            <span className="tracking-label">
              CIVIC REPORT
            </span>

            <h2>
              {selectedReport.title || "Civic Issue Report"}
            </h2>

            {selectedReport.complaintId && (
              <div className="tracking-id">
                {selectedReport.complaintId}
              </div>
            )}

            <div className="tracking-meta">
              <div>
                <span>Status</span>
                <strong>
                  {selectedReport.status || "Reported"}
                </strong>
              </div>

              <div>
                <span>Severity</span>
                <strong>
                  {selectedReport.severity || "Medium"}
                </strong>
              </div>

              <div>
                <span>Location</span>
                <strong>
                  {selectedReport.location || "Not specified"}
                </strong>
              </div>
            </div>

            {selectedReport.image && (
              <img
                src={selectedReport.image}
                alt={selectedReport.title || "Civic issue"}
                className="tracking-image"
              />
            )}

            {selectedReport.description && (
              <div className="tracking-description">
                {selectedReport.description}
              </div>
            )}

            <div className="tracking-timeline">
              <h3>Resolution Timeline</h3>

              {getTimeline(selectedReport).map((item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  className={`timeline-item ${item.status}`}
                >
                  <div className="timeline-dot"></div>

                  <div>
                    <strong>{item.title}</strong>

                    <span>
                      {item.status === "completed"
                        ? "Completed"
                        : "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default ExploreIssues;

