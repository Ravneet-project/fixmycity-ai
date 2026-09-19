
import { useState } from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  BrainCircuit,
  LoaderCircle,
  MapPin,
  Sparkles,
  Send,
  CheckCircle2,
  Copy,
  Navigation,
} from "lucide-react";

import UploadBox from "../components/UploadBox";
import AnalysisResult from "../components/AnalysisResult";

import {
  generateComplaintId,
  saveReport,
} from "../utils/reportStorage";

import {
  classifyCivicIssue,
} from "../utils/aiClassifier";

import {
  findNearestDepartment,
} from "../utils/departmentResolver";

const ReportIssue = () => {
  const [image, setImage] =
    useState(null);

  const [imageFile, setImageFile] =
    useState(null);

  const [location, setLocation] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [analyzing, setAnalyzing] =
    useState(false);

  const [result, setResult] =
    useState(null);

  const [
    submittedReport,
    setSubmittedReport,
  ] = useState(null);

  const [
    coordinates,
    setCoordinates,
  ] = useState(null);

  const [
    gettingLocation,
    setGettingLocation,
  ] = useState(false);

  const [
    locationError,
    setLocationError,
  ] = useState("");

  const handleImageChange = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    setImageFile(file);

    const reader =
      new FileReader();

    reader.onloadend = () => {
      setImage(
        reader.result
      );

      setResult(null);

      setSubmittedReport(
        null
      );
    };

    reader.readAsDataURL(file);
  };

  const handleCurrentLocation = () => {
    if (
      !navigator.geolocation
    ) {
      setLocationError(
        "Geolocation is not supported by this browser."
      );

      return;
    }

    setGettingLocation(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        setCoordinates({
          latitude,
          longitude,
        });

        setLocation(
          `${latitude.toFixed(
            5
          )}, ${longitude.toFixed(
            5
          )}`
        );

        setGettingLocation(
          false
        );
      },

      (error) => {
        console.error(
          "Location error:",
          error
        );

        setLocationError(
          "Unable to access your location. Please allow location permission."
        );

        setGettingLocation(
          false
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  };

  const handleAnalyze = () => {
    if (!imageFile) {
      alert(
        "Please upload an issue image first."
      );

      return;
    }

    setAnalyzing(true);

    setResult(null);

    setSubmittedReport(
      null
    );

    setTimeout(() => {
      const analysis =
        classifyCivicIssue({
          fileName:
            imageFile.name,

          description,

          location,
        });

      setResult(
        analysis
      );

      setAnalyzing(false);
    }, 2600);
  };

  const handleSubmitReport =
    () => {
      if (!result) {
        return;
      }

      const complaintId =
        generateComplaintId();

      const now =
        new Date().toISOString();

      let assignedDepartment =
        null;

      if (coordinates) {
        assignedDepartment =
          findNearestDepartment({
            latitude:
              coordinates.latitude,

            longitude:
              coordinates.longitude,

            category:
              result.category,
          });
      }

      const newReport = {
        id: Date.now(),

        complaintId,

        title:
          result.issue,

        category:
          result.category,

        location:
          location ||
          "Location not specified",

        coordinates,

        assignedDepartment:
          assignedDepartment
            ? {
                id:
                  assignedDepartment.id,

                name:
                  assignedDepartment.name,

                contact:
                  assignedDepartment.contact,

                distance:
                  Number(
                    assignedDepartment.distance.toFixed(
                      2
                    )
                  ),
              }
            : null,

        description:
          description ||
          result.description,

        status:
          "Reported",

        severity:
          result.severity,

        priority:
          result.priority,

        confidence:
          result.confidence,

        image,

        createdAt:
          now,

        updatedAt:
          now,

        timeline: [
          {
            title:
              "Issue Reported",

            status:
              "completed",

            date:
              now,
          },

          {
            title:
              "AI Verification",

            status:
              "completed",

            date:
              now,
          },

          {
            title:
              "Department Assigned",

            status:
              assignedDepartment
                ? "completed"
                : "pending",

            date:
              assignedDepartment
                ? now
                : null,
          },

          {
            title:
              "Resolution",

            status:
              "pending",

            date:
              null,
          },
        ],
      };

      saveReport(
        newReport
      );

      setSubmittedReport(
        newReport
      );
    };

  const handleCopyId =
    async () => {
      if (
        !submittedReport
      ) {
        return;
      }

      try {
        await navigator.clipboard.writeText(
          submittedReport.complaintId
        );
      } catch (error) {
        console.error(
          "Unable to copy complaint ID",
          error
        );
      }
    };

  const handleReset = () => {
    setImage(null);

    setImageFile(null);

    setLocation("");

    setDescription("");

    setAnalyzing(false);

    setResult(null);

    setSubmittedReport(
      null
    );

    setCoordinates(
      null
    );

    setGettingLocation(
      false
    );

    setLocationError("");
  };

  return (
    <section
      id="report"
      className="report-section"
    >
      <div className="report-background-glow"></div>

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
          className="report-heading"
        >
          <div className="section-badge">
            <Sparkles
              size={16}
            />

            Smart Civic
            Reporting
          </div>

          <h2>
            Report It.

            <span>
              Let AI
              Understand It.
            </span>
          </h2>

          <p>
            Upload a photo of
            the civic problem.
            FixMyCity AI
            analyzes the issue,
            estimates severity
            and automatically
            routes it to the
            relevant civic
            department.
          </p>
        </motion.div>

        <div className="report-layout">
          <motion.div
            initial={{
              opacity: 0,
              x: -40,
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
              delay: 0.1,
            }}
            className="report-card"
          >
            <div className="report-card-header">
              <div>
                <span>
                  STEP 01
                </span>

                <h3>
                  Upload Issue
                </h3>
              </div>

              <div className="report-card-icon">
                <BrainCircuit
                  size={21}
                />
              </div>
            </div>

            <UploadBox
              image={image}
              onImageChange={
                handleImageChange
              }
            />

            <div className="report-form">
              <div className="form-group">
                <label>
                  Location
                </label>

                <div className="input-with-icon">
                  <MapPin
                    size={17}
                  />

                  <input
                    type="text"
                    value={
                      location
                    }
                    onChange={(
                      e
                    ) => {
                      setLocation(
                        e.target
                          .value
                      );
                    }}
                    placeholder="Enter location or use GPS"
                  />
                </div>

                <button
                  type="button"
                  className="current-location-button"
                  onClick={
                    handleCurrentLocation
                  }
                  disabled={
                    gettingLocation
                  }
                >
                  {gettingLocation ? (
                    <>
                      <LoaderCircle
                        size={16}
                        className="spin-icon"
                      />

                      Detecting
                      Location...
                    </>
                  ) : (
                    <>
                      <Navigation
                        size={16}
                      />

                      Use Current
                      Location
                    </>
                  )}
                </button>

                {locationError && (
                  <div className="location-error">
                    {
                      locationError
                    }
                  </div>
                )}

                {coordinates && (
                  <div className="coordinate-preview">
                    <MapPin
                      size={14}
                    />

                    <span>
                      Latitude:{" "}
                      {coordinates.latitude.toFixed(
                        5
                      )}
                    </span>

                    <span>
                      Longitude:{" "}
                      {coordinates.longitude.toFixed(
                        5
                      )}
                    </span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>
                  Additional
                  Details
                </label>

                <textarea
                  value={
                    description
                  }
                  onChange={(
                    e
                  ) =>
                    setDescription(
                      e.target
                        .value
                    )
                  }
                  placeholder="Describe the issue..."
                />
              </div>

              <button
                className="ai-analyze-button"
                onClick={
                  handleAnalyze
                }
                disabled={
                  analyzing
                }
              >
                {analyzing ? (
                  <>
                    <LoaderCircle
                      size={18}
                      className="spin-icon"
                    />

                    AI
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles
                      size={18}
                    />

                    Analyze with
                    AI
                  </>
                )}
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              x: 40,
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
              delay: 0.15,
            }}
            className="analysis-panel"
          >
            <div className="analysis-top">
              <span>
                STEP 02
              </span>

              <h3>
                AI Analysis
              </h3>
            </div>

            <AnimatePresence
              mode="wait"
            >
              {!image && (
                <motion.div
                  key="empty"
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  className="analysis-empty"
                >
                  <div className="analysis-orb">
                    <BrainCircuit
                      size={42}
                    />
                  </div>

                  <h4>
                    Waiting for
                    an issue
                  </h4>

                  <p>
                    Upload an
                    image and
                    click analyze
                    to see
                    FixMyCity AI
                    in action.
                  </p>
                </motion.div>
              )}

              {image &&
                analyzing && (
                  <motion.div
                    key="scanning"
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    className="ai-scanning"
                  >
                    <div className="scan-preview">
                      <img
                        src={
                          image
                        }
                        alt="Scanning"
                      />

                      <div className="scan-line"></div>

                      <div className="scan-grid"></div>

                      <div className="scan-label">
                        AI VISION
                        SCAN
                      </div>
                    </div>

                    <div className="scanning-info">
                      <LoaderCircle
                        size={20}
                        className="spin-icon"
                      />

                      <div>
                        <strong>
                          Analyzing
                          image...
                        </strong>

                        <span>
                          Detecting
                          civic issue,
                          severity and
                          priority
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

              {result &&
                !analyzing &&
                !submittedReport && (
                  <motion.div
                    key="result"
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    className="result-wrapper"
                  >
                    <AnalysisResult
                      result={
                        result
                      }
                    />

                    {coordinates && (
                      <div className="ai-location-ready">
                        <Navigation
                          size={
                            16
                          }
                        />

                        GPS location
                        captured and
                        ready for
                        civic routing.
                      </div>
                    )}

                    <button
                      className="submit-report-button"
                      onClick={
                        handleSubmitReport
                      }
                    >
                      <Send
                        size={17}
                      />

                      Submit Civic
                      Report
                    </button>
                  </motion.div>
                )}

              {submittedReport && (
                <motion.div
                  key="submitted"
                  initial={{
                    opacity: 0,
                    scale: 0.96,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                  }}
                  className="report-success-card"
                >
                  <div className="success-check">
                    <CheckCircle2
                      size={34}
                    />
                  </div>

                  <span className="success-label">
                    REPORT
                    SUBMITTED
                  </span>

                  <h3>
                    Your issue is
                    now being
                    tracked.
                  </h3>

                  <p>
                    Save your
                    complaint ID
                    to check the
                    progress of
                    your civic
                    report.
                  </p>

                  <div className="complaint-id-box">
                    <div>
                      <span>
                        Complaint
                        ID
                      </span>

                      <strong>
                        {
                          submittedReport.complaintId
                        }
                      </strong>
                    </div>

                    <button
                      type="button"
                      onClick={
                        handleCopyId
                      }
                      title="Copy complaint ID"
                    >
                      <Copy
                        size={16}
                      />
                    </button>
                  </div>

                  <div className="submission-status">
                    <span>
                      Current
                      Status
                    </span>

                    <strong>
                      {
                        submittedReport.status
                      }
                    </strong>
                  </div>

                  {submittedReport.assignedDepartment && (
                    <div className="assigned-department-card">
                      <span>
                        AUTO
                        ASSIGNED
                        DEPARTMENT
                      </span>

                      <strong>
                        {
                          submittedReport
                            .assignedDepartment
                            .name
                        }
                      </strong>

                      <small>
                        {
                          submittedReport
                            .assignedDepartment
                            .distance
                        }{" "}
                        km away
                      </small>

                      <div className="department-contact">
                        Contact:{" "}
                        {
                          submittedReport
                            .assignedDepartment
                            .contact
                        }
                      </div>
                    </div>
                  )}

                  {!submittedReport.assignedDepartment && (
                    <div className="department-pending-card">
                      <MapPin
                        size={16}
                      />

                      <div>
                        <strong>
                          Department
                          assignment
                          pending
                        </strong>

                        <span>
                          Use current
                          location before
                          submitting for
                          automatic civic
                          routing.
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="report-success-actions">
                    <a
                      href="#track"
                      className="track-report-button"
                    >
                      Track
                      Complaint
                    </a>

                    <button
                      type="button"
                      className="new-report-button"
                      onClick={
                        handleReset
                      }
                    >
                      Report
                      Another Issue
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ReportIssue;
