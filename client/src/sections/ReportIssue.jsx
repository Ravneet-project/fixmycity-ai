import {
  useEffect,
  useState,
} from "react";

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

  const [
    locationDetected,
    setLocationDetected,
  ] = useState(false);

  // =========================================
  // AI ASSISTANT CONNECTION
  // =========================================

  useEffect(() => {
    const handleAssistantReport = (
      event
    ) => {
      const {
        description:
          assistantDescription,
      } =
        event.detail || {};

      if (
        assistantDescription
      ) {
        setDescription(
          assistantDescription
        );
      }

      setResult(null);

      setSubmittedReport(
        null
      );
    };

    window.addEventListener(
      "fixmycity-assistant-report",
      handleAssistantReport
    );

    return () => {
      window.removeEventListener(
        "fixmycity-assistant-report",
        handleAssistantReport
      );
    };
  }, []);

  // =========================================
  // IMAGE UPLOAD
  // =========================================

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

  // =========================================
  // FORMAT ADDRESS
  // =========================================

  const formatDetectedAddress = (
    data
  ) => {
    const address =
      data?.address || {};

    const area =
      address.suburb ||
      address.neighbourhood ||
      address.quarter ||
      address.residential ||
      address.hamlet ||
      address.village ||
      address.town ||
      address.city_district ||
      "";

    const city =
      address.city ||
      address.town ||
      address.municipality ||
      address.county ||
      "";

    const state =
      address.state ||
      "";

    const country =
      address.country ||
      "";

    const parts = [
      area,
      city,
      state,
      country,
    ].filter(
      (item, index, array) =>
        item &&
        array.indexOf(item) ===
          index
    );

    if (parts.length > 0) {
      return parts.join(", ");
    }

    if (data?.display_name) {
      return data.display_name;
    }

    return "Current Location";
  };

  // =========================================
  // REVERSE GEOCODING
  // =========================================

  const getAddressFromCoordinates =
    async (
      latitude,
      longitude
    ) => {
      try {
        const response =
          await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );

        if (!response.ok) {
          throw new Error(
            "Unable to detect address"
          );
        }

        const data =
          await response.json();

        return formatDetectedAddress(
          data
        );
      } catch (error) {
        console.error(
          "Reverse geocoding error:",
          error
        );

        return "Current Location";
      }
    };

  // =========================================
  // CURRENT LOCATION
  // =========================================

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

    setLocationDetected(false);

    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude =
            position.coords.latitude;

          const longitude =
            position.coords.longitude;

          setCoordinates({
            latitude,
            longitude,
          });

          const detectedAddress =
            await getAddressFromCoordinates(
              latitude,
              longitude
            );

          setLocation(
            detectedAddress
          );

          setLocationDetected(
            true
          );
        } catch (error) {
          console.error(
            "Location processing error:",
            error
          );

          setLocationError(
            "Location was detected, but the address could not be identified."
          );
        } finally {
          setGettingLocation(
            false
          );
        }
      },

      (error) => {
        console.error(
          "Location error:",
          error
        );

        let message =
          "Unable to access your location.";

        if (error.code === 1) {
          message =
            "Location permission was denied. Please allow location access in your browser.";
        }

        if (error.code === 2) {
          message =
            "Your current location is unavailable. Please try again.";
        }

        if (error.code === 3) {
          message =
            "Location detection timed out. Please try again.";
        }

        setLocationError(
          message
        );

        setGettingLocation(
          false
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 30000,
      }
    );
  };

  // =========================================
  // AI ANALYSIS
  // =========================================

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

  // =========================================
  // SUBMIT REPORT
  // =========================================

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

            location,
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

                city:
                  assignedDepartment.city,

                name:
                  assignedDepartment.name,

                category:
                  assignedDepartment.category,

                contact:
                  assignedDepartment.contact,

                distance:
                  Number(
                    assignedDepartment.distance.toFixed(
                      2
                    )
                  ),

                latitude:
                  assignedDepartment.latitude,

                longitude:
                  assignedDepartment.longitude,
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

  // =========================================
  // COPY COMPLAINT ID
  // =========================================

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

  // =========================================
  // RESET
  // =========================================

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

    setLocationDetected(
      false
    );
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

            Smart Civic Reporting
          </div>

          <h2>
            Report It.

            <span>
              Let AI Understand It.
            </span>
          </h2>

          <p>
            Upload a photo of the
            civic problem. FixMyCity
            AI analyzes the issue,
            estimates severity and
            automatically routes it
            to the relevant civic
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
                    onChange={(e) => {
                      setLocation(
                        e.target.value
                      );

                      setLocationDetected(
                        false
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

                      Detecting Location...
                    </>
                  ) : (
                    <>
                      <Navigation
                        size={16}
                      />

                      Use Current Location
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

                {coordinates &&
                  locationDetected &&
                  location && (
                    <div className="detected-location-card">
                      <MapPin
                        size={16}
                      />

                      <div>
                        <span>
                          LOCATION DETECTED
                        </span>

                        <strong>
                          {location}
                        </strong>
                      </div>
                    </div>
                  )}
              </div>

              <div className="form-group">
                <label>
                  Additional Details
                </label>

                <textarea
                  value={
                    description
                  }
                  onChange={(e) =>
                    setDescription(
                      e.target.value
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

                    AI Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles
                      size={18}
                    />

                    Analyze with AI
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
                    Waiting for an issue
                  </h4>

                  <p>
                    Upload an image and
                    click analyze to see
                    FixMyCity AI in action.
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
                        AI VISION SCAN
                      </div>
                    </div>

                    <div className="scanning-info">
                      <LoaderCircle
                        size={20}
                        className="spin-icon"
                      />

                      <div>
                        <strong>
                          Analyzing image...
                        </strong>

                        <span>
                          Detecting civic
                          issue, severity
                          and priority
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

                    {coordinates &&
                      location && (
                        <div className="ai-location-ready">
                          <Navigation
                            size={16}
                          />

                          Location detected:
                          {" "}
                          {location}
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

                      Submit Civic Report
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
                    REPORT SUBMITTED
                  </span>

                  <h3>
                    Your issue is now
                    being tracked.
                  </h3>

                  <p>
                    Save your complaint
                    ID to check the
                    progress of your
                    civic report.
                  </p>

                  <div className="complaint-id-box">
                    <div>
                      <span>
                        Complaint ID
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
                      Current Status
                    </span>

                    <strong>
                      {
                        submittedReport.status
                      }
                    </strong>
                  </div>

                  <div className="submitted-location-card">
                    <MapPin
                      size={16}
                    />

                    <div>
                      <span>
                        REPORTED LOCATION
                      </span>

                      <strong>
                        {
                          submittedReport.location
                        }
                      </strong>
                    </div>
                  </div>

                  {submittedReport.assignedDepartment && (
                    <div className="assigned-department-card">
                      <span>
                        AUTO ASSIGNED
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
                        {submittedReport
                          .assignedDepartment
                          .city
                          ? `${submittedReport.assignedDepartment.city} • `
                          : ""}
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
                          assignment pending
                        </strong>

                        <span>
                          Use current location
                          before submitting
                          for automatic civic
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
                      Track Complaint
                    </a>

                    <button
                      type="button"
                      className="new-report-button"
                      onClick={
                        handleReset
                      }
                    >
                      Report Another Issue
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