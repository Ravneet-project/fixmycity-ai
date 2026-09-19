import {
  useRef,
} from "react";

import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

import {
  Camera,
  BrainCircuit,
  Route,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import "./Impact.css";

const Impact = () => {
  const sectionRef =
    useRef(null);

  const {
    scrollYProgress,
  } = useScroll({
    target: sectionRef,
    offset: [
      "start end",
      "end start",
    ],
  });

  const imageScale =
    useTransform(
      scrollYProgress,
      [0, 0.45, 1],
      [0.88, 1.04, 1.14]
    );

  const imageY =
    useTransform(
      scrollYProgress,
      [0, 1],
      [70, -50]
    );

  const imageRotate =
    useTransform(
      scrollYProgress,
      [0, 0.5, 1],
      [-4, 0, 3]
    );

  const imageOpacity =
    useTransform(
      scrollYProgress,
      [0, 0.15, 0.85, 1],
      [0.45, 1, 1, 0.7]
    );

  const steps = [
    {
      icon:
        Camera,

      title:
        "Capture",

      text:
        "Upload a photo or report an issue.",

      className:
        "impact-step-cyan",
    },

    {
      icon:
        BrainCircuit,

      title:
        "AI Analyze",

      text:
        "AI detects category, severity and priority.",

      className:
        "impact-step-purple",
    },

    {
      icon:
        Route,

      title:
        "Route",

      text:
        "The issue is assigned to the right department.",

      className:
        "impact-step-blue",
    },

    {
      icon:
        CheckCircle2,

      title:
        "Resolve",

      text:
        "Track progress until the issue is fixed.",

      className:
        "impact-step-green",
    },
  ];

  return (
    <section
      id="impact"
      ref={sectionRef}
      className="impact-section-v2"
    >
      <div className="impact-bg-glow"></div>

      <div className="container impact-container-v2">

        <motion.div
          initial={{
            opacity: 0,
            y: 24,
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
          className="impact-title-v2"
        >
          <div className="section-badge">
            <Sparkles
              size={16}
            />

            Real Civic Impact
          </div>

          <h2>
            From Report To
            <span>
              Real Change.
            </span>
          </h2>

          <p>
            Capture a civic issue,
            let AI understand the
            problem, identify its
            urgency, and help your
            city respond faster.
          </p>
        </motion.div>

        <div className="impact-grid-v2">

          <div className="impact-visual-side">
            <div className="impact-visual-glow"></div>

            <div className="impact-ring impact-ring-one"></div>
            <div className="impact-ring impact-ring-two"></div>

            <motion.div
              style={{
                scale:
                  imageScale,

                y:
                  imageY,

                rotate:
                  imageRotate,

                opacity:
                  imageOpacity,
              }}
              className="impact-photo-card"
            >
              <img
                src="/images/impact-road.jpg"
                alt="Real civic road issue"
              />

              <div className="impact-photo-overlay"></div>

              <div className="impact-photo-live">
                <span></span>

                REAL CIVIC ISSUE
              </div>

              <div className="impact-photo-info">
                <span>
                  AI CIVIC VISION
                </span>

                <strong>
                  Turning reports
                  into measurable
                  action.
                </strong>
              </div>
            </motion.div>
          </div>

          <div className="impact-process-side">
            <div className="impact-process-line"></div>

            {steps.map(
              (
                step,
                index
              ) => {
                const Icon =
                  step.icon;

                return (
                  <motion.div
                    key={
                      step.title
                    }
                    initial={{
                      opacity: 0,
                      x: 30,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration:
                        0.55,

                      delay:
                        index *
                        0.12,
                    }}
                    className="impact-process-step"
                  >
                    <div
                      className={`impact-step-icon ${step.className}`}
                    >
                      <Icon
                        size={
                          22
                        }
                      />
                    </div>

                    <div>
                      <strong>
                        {
                          step.title
                        }
                      </strong>

                      <span>
                        {
                          step.text
                        }
                      </span>
                    </div>
                  </motion.div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Impact;