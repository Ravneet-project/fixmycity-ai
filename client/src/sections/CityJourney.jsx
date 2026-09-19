import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  MapPin,
  Camera,
  BrainCircuit,
  Route,
  CheckCircle2,
} from "lucide-react";

const CityJourney = () => {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const cityY = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    [-160, 80, 420]
  );

  const cityScale = useTransform(
    scrollYProgress,
    [0, 0.4, 1],
    [0.75, 1.05, 0.82]
  );

  const cityRotate = useTransform(
    scrollYProgress,
    [0, 1],
    [-8, 18]
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.8, 1],
    [0, 1, 1, 0]
  );

  return (
    <section
      ref={sectionRef}
      id="explore"
      className="city-journey-section"
    >
      <div className="city-journey-sticky">
        <div className="journey-content container">
          <motion.div
            style={{
              y: cityY,
              scale: cityScale,
              rotateZ: cityRotate,
              opacity,
            }}
            className="journey-city-wrap"
          >
            <div className="journey-city-glow"></div>

            <div className="journey-city">
              <div className="journey-ring ring-a"></div>
              <div className="journey-ring ring-b"></div>

              <div className="journey-platform">
                <div className="journey-road road-a"></div>
                <div className="journey-road road-b"></div>

                <div className="journey-building jb1"></div>
                <div className="journey-building jb2"></div>
                <div className="journey-building jb3"></div>
                <div className="journey-building jb4"></div>
                <div className="journey-building jb5"></div>

                <div className="journey-pin pin-one">
                  <MapPin size={18} />
                </div>

                <div className="journey-pin pin-two">
                  <MapPin size={18} />
                </div>

                <div className="journey-pin pin-three">
                  <MapPin size={18} />
                </div>
              </div>
            </div>
          </motion.div>

          <div className="journey-copy">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="section-badge"
            >
              <BrainCircuit size={16} />
              AI Powered Civic Intelligence
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75 }}
              viewport={{ once: true }}
            >
              Your Report Starts
              <span>Real Change.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Capture a civic issue, let AI understand the problem,
              identify its urgency, and help your city respond faster.
            </motion.p>

            <div className="journey-steps">
              <div className="journey-step">
                <div className="step-icon cyan">
                  <Camera size={20} />
                </div>

                <div>
                  <strong>Capture</strong>
                  <span>Upload a photo or report an issue.</span>
                </div>
              </div>

              <div className="journey-line"></div>

              <div className="journey-step">
                <div className="step-icon purple">
                  <BrainCircuit size={20} />
                </div>

                <div>
                  <strong>AI Analyze</strong>
                  <span>
                    AI detects category, severity and priority.
                  </span>
                </div>
              </div>

              <div className="journey-line"></div>

              <div className="journey-step">
                <div className="step-icon blue">
                  <Route size={20} />
                </div>

                <div>
                  <strong>Route</strong>
                  <span>
                    The issue is assigned to the right department.
                  </span>
                </div>
              </div>

              <div className="journey-line"></div>

              <div className="journey-step">
                <div className="step-icon green">
                  <CheckCircle2 size={20} />
                </div>

                <div>
                  <strong>Resolve</strong>
                  <span>
                    Track progress until the issue is fixed.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CityJourney;