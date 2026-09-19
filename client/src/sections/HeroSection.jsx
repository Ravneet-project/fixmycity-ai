import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  CircleUserRound,
  Leaf,
  Play,
  ShieldCheck,
  Trash2,
  Users,
  Zap,
} from "lucide-react";

import GlowButton from "../components/GlowButton";
import StatCard from "../components/StatCard";

const HeroSection = () => {
  return (
    <section id="home" className="hero-section">
      <div className="hero-container container">
        <div className="hero-left">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="hero-badge"
          >
            <span>Cleaner Cities</span>
            <i></i>
            <span>Safer Streets</span>
            <i></i>
            <span>Brighter Tomorrows</span>
          </motion.div>

          <motion.h1
            initial={{
              opacity: 0,
              y: 35,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.1,
            }}
            className="hero-title"
          >
            See a Problem?
            <span>Let's Fix It.</span>
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.2,
            }}
            className="hero-description"
          >
            FixMyCity AI helps citizens report,
            analyze and track civic issues using
            artificial intelligence. Together,
            we can build cleaner, safer and smarter
            cities.
          </motion.p>

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.3,
            }}
            className="hero-actions"
          >
            <GlowButton
              icon={<ArrowRight size={18} />}
            >
              Report an Issue
            </GlowButton>

            <GlowButton
              variant="secondary"
              icon={<Play size={16} />}
            >
              Watch Demo
            </GlowButton>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 1,
              delay: 0.5,
            }}
            className="hero-community"
          >
            <div className="community-avatars">
              <div>R</div>
              <div>A</div>
              <div>K</div>
              <div>P</div>
              <div>M</div>
            </div>

            <div>
              <strong>10,000+</strong>
              <span>
                citizens already making a difference
              </span>
            </div>
          </motion.div>
        </div>

        <div className="hero-right">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.88,
              rotateX: 5,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotateX: 0,
            }}
            transition={{
              duration: 1,
              delay: 0.2,
            }}
            className="city-preview"
          >
            <div className="city-orbit orbit-one"></div>
            <div className="city-orbit orbit-two"></div>

            <div className="city-platform">
              <div className="platform-ring"></div>

              <div className="city-buildings">
                <div className="building building-one">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <div className="building building-two">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <div className="building building-three">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <div className="building building-four">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <div className="building building-five">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>

              <div className="road road-one"></div>
              <div className="road road-two"></div>

              <div className="city-tree tree-one"></div>
              <div className="city-tree tree-two"></div>
              <div className="city-tree tree-three"></div>

              <div className="city-platform-text">
                <span>CLEANER CITIES</span>
                <strong>BRIGHTER TOMORROWS</strong>
              </div>
            </div>

            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="issue-card issue-card-one"
            >
              <div className="issue-icon red">
                <Zap size={17} />
              </div>

              <div>
                <strong>Street Light</strong>
                <span>AI Detected</span>
                <small>High Priority</small>
              </div>
            </motion.div>

            <motion.div
              animate={{
                y: [0, 8, 0],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="issue-card issue-card-two"
            >
              <div className="issue-icon green">
                <Trash2 size={17} />
              </div>

              <div>
                <strong>Garbage</strong>
                <span>Reported</span>
                <small className="success">
                  In Progress
                </small>
              </div>
            </motion.div>

            <motion.div
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="issue-card issue-card-three"
            >
              <div className="issue-icon blue">
                <ShieldCheck size={17} />
              </div>

              <div>
                <strong>Pothole</strong>
                <span>Reported</span>
                <small className="blue-text">
                  Resolved
                </small>
              </div>
            </motion.div>

            <div className="city-glow-base"></div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{
          opacity: 0,
          y: 25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.6,
          duration: 0.8,
        }}
        className="stats-wrapper container"
      >
        <StatCard
          icon={<CircleUserRound size={23} />}
          value="2,341"
          label="Issues Reported"
          className="stat-cyan"
        />

        <StatCard
          icon={<CheckCircle2 size={23} />}
          value="1,892"
          label="Issues Resolved"
          className="stat-green"
        />

        <StatCard
          icon={<Users size={23} />}
          value="10,000+"
          label="Active Citizens"
          className="stat-purple"
        />

        <StatCard
          icon={<Leaf size={23} />}
          value="25%"
          label="Cleaner Neighbourhoods"
          className="stat-emerald"
        />

        <div className="hero-quote">
          <div>
            “Technology becomes meaningful when it
            helps real people create real change.”
          </div>

          <span>— FixMyCity AI</span>
        </div>
      </motion.div>

      <div className="scroll-indicator">
        <span>Scroll to explore</span>

        <div className="mouse">
          <div></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;