import { useState } from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  Bot,
  X,
  Send,
  Sparkles,
  Trash2,
  Construction,
  Lightbulb,
  Droplets,
  ArrowRight,
  Search,
  CheckCircle2,
  Clock3,
  Wrench,
  Building2,
  MapPin,
  ShieldAlert,
} from "lucide-react";

import {
  getSavedReports,
} from "../utils/reportStorage";

const suggestions = [
  {
    text: "There is a big pothole on my road",
    icon: Construction,
  },
  {
    text: "Garbage is overflowing in my area",
    icon: Trash2,
  },
  {
    text: "Street light is not working",
    icon: Lightbulb,
  },
  {
    text: "Water pipe is leaking",
    icon: Droplets,
  },
];

const detectIssue = (message) => {
  const text =
    message.toLowerCase();

  if (
    text.includes("pothole") ||
    text.includes("road") ||
    text.includes("crack") ||
    text.includes("gadda")
  ) {
    return {
      category:
        "Road Damage",

      description:
        message,

      reply:
        "I detected a possible road damage issue. I'll prepare the report form for you.",

      confidence:
        96,
    };
  }

  if (
    text.includes("garbage") ||
    text.includes("trash") ||
    text.includes("waste") ||
    text.includes("kachra") ||
    text.includes("dustbin")
  ) {
    return {
      category:
        "Waste",

      description:
        message,

      reply:
        "This looks like a waste management issue. I'll prefill the civic report for you.",

      confidence:
        94,
    };
  }

  if (
    text.includes("light") ||
    text.includes("streetlight") ||
    text.includes("lamp") ||
    text.includes("dark")
  ) {
    return {
      category:
        "Street Light",

      description:
        message,

      reply:
        "I detected a street-lighting problem. Let's prepare a report for the lighting department.",

      confidence:
        93,
    };
  }

  if (
    text.includes("water") ||
    text.includes("leak") ||
    text.includes("pipe") ||
    text.includes("sewer") ||
    text.includes("sewage") ||
    text.includes("drain")
  ) {
    return {
      category:
        "Water",

      description:
        message,

      reply:
        "This appears to be a water or drainage issue. I'll prepare the report details.",

      confidence:
        95,
    };
  }

  return {
    category:
      "Other",

    description:
      message,

    reply:
      "I understand that you're reporting a civic issue. I'll open the report form so you can add a photo and location.",

    confidence:
      82,
  };
};

const extractComplaintId = (
  message
) => {
  const match =
    message
      .toUpperCase()
      .match(
        /FMC-\d{4}-\d{6}/
      );

  return match
    ? match[0]
    : null;
};

const CivicAssistant = () => {
  const [open, setOpen] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [
    messages,
    setMessages,
  ] = useState([
    {
      type: "bot",

      text:
        "Hi 👋 I'm the FixMyCity AI Assistant. Tell me about a civic issue or enter your complaint ID to track it.",
    },
  ]);

  const [
    detected,
    setDetected,
  ] = useState(null);

  const [
    trackedReport,
    setTrackedReport,
  ] = useState(null);

  const [
    trackingError,
    setTrackingError,
  ] = useState("");

  const addMessages = (
    newMessages
  ) => {
    setMessages(
      (current) => [
        ...current,
        ...newMessages,
      ]
    );
  };

  const findComplaint = (
    id
  ) => {
    const reports =
      getSavedReports();

    const found =
      reports.find(
        (item) =>
          item.complaintId
            ?.toUpperCase() ===
          id.toUpperCase()
      );

    if (!found) {
      setTrackedReport(
        null
      );

      setDetected(null);

      setTrackingError(
        `I couldn't find complaint ${id}. Please check the complaint ID and try again.`
      );

      addMessages([
        {
          type: "bot",
          text:
            `I couldn't find complaint ${id}. Please check the complaint ID and try again.`,
        },
      ]);

      return;
    }

    setTrackingError("");

    setDetected(null);

    setTrackedReport(
      found
    );

    addMessages([
      {
        type: "bot",

        text:
          `I found complaint ${found.complaintId}. Its current status is ${found.status}.`,
      },
    ]);
  };

  const handleMessage = (
    customMessage = null
  ) => {
    const finalMessage =
      (
        customMessage ||
        message
      ).trim();

    if (!finalMessage) {
      return;
    }

    setMessage("");

    addMessages([
      {
        type: "user",
        text:
          finalMessage,
      },
    ]);

    const complaintId =
      extractComplaintId(
        finalMessage
      );

    if (complaintId) {
      findComplaint(
        complaintId
      );

      return;
    }

    const lowerMessage =
      finalMessage
        .toLowerCase();

    const statusIntent =
      lowerMessage.includes(
        "status"
      ) ||
      lowerMessage.includes(
        "track"
      ) ||
      lowerMessage.includes(
        "complaint"
      );

    if (statusIntent) {
      setDetected(null);

      setTrackedReport(
        null
      );

      addMessages([
        {
          type: "bot",

          text:
            "Please enter your complaint ID, for example FMC-2026-123456, and I'll check its latest status.",
        },
      ]);

      return;
    }

    const analysis =
      detectIssue(
        finalMessage
      );

    setTrackedReport(
      null
    );

    setTrackingError("");

    setDetected(
      analysis
    );

    addMessages([
      {
        type: "bot",

        text:
          analysis.reply,
      },
    ]);
  };

  const startReport = () => {
    if (!detected) {
      return;
    }

    window.dispatchEvent(
      new CustomEvent(
        "fixmycity-assistant-report",
        {
          detail: {
            category:
              detected.category,

            description:
              detected.description,
          },
        }
      )
    );

    const reportSection =
      document.getElementById(
        "report"
      );

    reportSection?.scrollIntoView({
      behavior:
        "smooth",

      block:
        "start",
    });

    setOpen(false);
  };

  const openTracking = () => {
    if (
      !trackedReport
    ) {
      return;
    }

    const trackSection =
      document.getElementById(
        "track"
      );

    if (
      trackSection
    ) {
      trackSection.scrollIntoView({
        behavior:
          "smooth",

        block:
          "start",
      });
    }

    setOpen(false);
  };

  const getStatusIcon = () => {
    if (
      !trackedReport
    ) {
      return (
        <Clock3
          size={17}
        />
      );
    }

    if (
      trackedReport.status ===
      "Resolved"
    ) {
      return (
        <CheckCircle2
          size={17}
        />
      );
    }

    if (
      trackedReport.status ===
      "In Progress"
    ) {
      return (
        <Wrench
          size={17}
        />
      );
    }

    return (
      <Clock3
        size={17}
      />
    );
  };

  return (
    <>
      <motion.button
        className="civic-assistant-trigger"
        onClick={() =>
          setOpen(
            !open
          )
        }
        whileHover={{
          scale: 1.07,
        }}
        whileTap={{
          scale: 0.94,
        }}
        aria-label="Open FixMyCity AI Assistant"
      >
        <span className="assistant-trigger-glow"></span>

        {open ? (
          <X
            size={24}
          />
        ) : (
          <Bot
            size={25}
          />
        )}

        {!open && (
          <span className="assistant-online-dot"></span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 30,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.92,
              y: 20,
            }}
            transition={{
              duration: 0.25,
            }}
            className="civic-assistant-window"
          >
            <div className="assistant-header">
              <div className="assistant-avatar">
                <Bot
                  size={22}
                />

                <span></span>
              </div>

              <div>
                <strong>
                  FixMyCity AI
                </strong>

                <span>
                  Civic Assistant • Online
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setOpen(
                    false
                  )
                }
              >
                <X
                  size={18}
                />
              </button>
            </div>

            <div className="assistant-ai-strip">
              <Sparkles
                size={13}
              />

              Civic reporting &
              complaint tracking
            </div>

            <div className="assistant-messages">
              {messages.map(
                (
                  item,
                  index
                ) => (
                  <motion.div
                    key={
                      index
                    }
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className={`assistant-message ${item.type}`}
                  >
                    {
                      item.text
                    }
                  </motion.div>
                )
              )}

              {detected && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="assistant-detection-card"
                >
                  <span>
                    ISSUE DETECTED
                  </span>

                  <strong>
                    {
                      detected.category
                    }
                  </strong>

                  <div className="assistant-confidence">
                    <div>
                      <span>
                        AI Confidence
                      </span>

                      <strong>
                        {
                          detected.confidence
                        }%
                      </strong>
                    </div>

                    <div className="assistant-confidence-track">
                      <motion.div
                        initial={{
                          width:
                            0,
                        }}
                        animate={{
                          width: `${detected.confidence}%`,
                        }}
                        transition={{
                          duration:
                            0.7,
                        }}
                      ></motion.div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={
                      startReport
                    }
                  >
                    Continue to Report

                    <ArrowRight
                      size={15}
                    />
                  </button>
                </motion.div>
              )}

              {trackedReport && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="assistant-tracking-card"
                >
                  <div className="assistant-tracking-top">
                    <div>
                      <span>
                        COMPLAINT FOUND
                      </span>

                      <strong>
                        {
                          trackedReport.complaintId
                        }
                      </strong>
                    </div>

                    <div
                      className={`assistant-status-chip ${trackedReport.status
                        .toLowerCase()
                        .replaceAll(
                          " ",
                          "-"
                        )}`}
                    >
                      {
                        getStatusIcon()
                      }

                      {
                        trackedReport.status
                      }
                    </div>
                  </div>

                  <h4>
                    {
                      trackedReport.title
                    }
                  </h4>

                  <div className="assistant-tracking-info">
                    <div>
                      <MapPin
                        size={14}
                      />

                      <span>
                        {
                          trackedReport.location
                        }
                      </span>
                    </div>

                    <div>
                      <ShieldAlert
                        size={14}
                      />

                      <span>
                        {
                          trackedReport.priority
                        }{" "}
                        Priority
                      </span>
                    </div>
                  </div>

                  {trackedReport.assignedDepartment && (
                    <div className="assistant-department-mini">
                      <Building2
                        size={15}
                      />

                      <div>
                        <span>
                          Assigned Department
                        </span>

                        <strong>
                          {
                            trackedReport
                              .assignedDepartment
                              .name
                          }
                        </strong>

                        <small>
                          {
                            trackedReport
                              .assignedDepartment
                              .distance
                          }{" "}
                          km away
                        </small>
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    className="assistant-track-full-button"
                    onClick={
                      openTracking
                    }
                  >
                    <Search
                      size={15}
                    />

                    Track Full Report

                    <ArrowRight
                      size={15}
                    />
                  </button>
                </motion.div>
              )}

              {trackingError && (
                <div className="assistant-tracking-error">
                  {
                    trackingError
                  }
                </div>
              )}
            </div>

            {!detected &&
              !trackedReport && (
                <div className="assistant-suggestions">
                  <span>
                    TRY SAYING
                  </span>

                  <div>
                    {suggestions.map(
                      (
                        item,
                        index
                      ) => {
                        const Icon =
                          item.icon;

                        return (
                          <button
                            type="button"
                            key={
                              index
                            }
                            onClick={() =>
                              handleMessage(
                                item.text
                              )
                            }
                          >
                            <Icon
                              size={14}
                            />

                            {
                              item.text
                            }
                          </button>
                        );
                      }
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        setMessage(
                          "What is the status of FMC-2026-123456?"
                        )
                      }
                    >
                      <Search
                        size={14}
                      />

                      Check complaint status
                    </button>
                  </div>
                </div>
              )}

            <div className="assistant-input-area">
              <input
                type="text"
                value={
                  message
                }
                onChange={(e) =>
                  setMessage(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (
                    e.key ===
                    "Enter"
                  ) {
                    handleMessage();
                  }
                }}
                placeholder="Report an issue or enter complaint ID..."
              />

              <button
                type="button"
                onClick={() =>
                  handleMessage()
                }
              >
                <Send
                  size={17}
                />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CivicAssistant;