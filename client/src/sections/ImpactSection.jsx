import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock3,
  Leaf,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";

const impactStats = [
  {
    icon: <CheckCircle2 size={22} />,
    value: "1,892",
    label: "Issues Resolved",
    className: "impact-cyan",
  },
  {
    icon: <Users size={22} />,
    value: "10K+",
    label: "Active Citizens",
    className: "impact-purple",
  },
  {
    icon: <Clock3 size={22} />,
    value: "42%",
    label: "Faster Response",
    className: "impact-orange",
  },
  {
    icon: <Leaf size={22} />,
    value: "25%",
    label: "Cleaner Areas",
    className: "impact-green",
  },
];

const ImpactSection = () => {
  return (
    <section id="impact" className="impact-section">
      <div className="impact-orb impact-orb-one"></div>
      <div className="impact-orb impact-orb-two"></div>

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="impact-heading"
        >
          <div className="section-badge">
            <TrendingUp size={16} />
            Community Impact
          </div>

          <h2>
            Small Reports.
            <span>Big City Impact.</span>
          </h2>

          <p>
            Every report helps authorities understand local problems faster
            and gives citizens visibility into how their city is improving.
          </p>
        </motion.div>

        <div className="impact-stats-grid">
          {impactStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{
                opacity: 0,
                y: 25,
                scale: 0.96,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.55,
                delay: index * 0.08,
              }}
              whileHover={{
                y: -8,
                scale: 1.02,
              }}
              className={`impact-stat-card ${stat.className}`}
            >
              <div className="impact-stat-icon">
                {stat.icon}
              </div>

              <strong>{stat.value}</strong>
              <span>{stat.label}</span>

              <div className="impact-card-glow"></div>
            </motion.div>
          ))}
        </div>

        <div className="impact-main-grid">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="impact-comparison"
          >
            <div className="comparison-header">
              <div>
                <span>NEIGHBOURHOOD CHANGE</span>
                <h3>Before vs After</h3>
              </div>

              <div className="comparison-badge">
                <TrendingUp size={14} />
                +38% Improvement
              </div>
            </div>

            <div className="comparison-visual">
              <div className="comparison-side before-side">
                <div className="comparison-label">
                  Before
                </div>

                <div className="mini-city">
                  <div className="mini-road"></div>

                  <div className="mini-building b1"></div>
                  <div className="mini-building b2"></div>
                  <div className="mini-building b3"></div>

                  <div className="issue-dot dot-red"></div>
                  <div className="issue-dot dot-orange"></div>
                  <div className="issue-dot dot-red dot-third"></div>
                </div>

                <div className="comparison-info">
                  <strong>18 Active Issues</strong>
                  <span>Slow response & low visibility</span>
                </div>
              </div>

              <div className="comparison-divider">
                <div className="divider-arrow">
                  →
                </div>
              </div>

              <div className="comparison-side after-side">
                <div className="comparison-label success">
                  After
                </div>

                <div className="mini-city">
                  <div className="mini-road healthy"></div>

                  <div className="mini-building b1 success-building"></div>
                  <div className="mini-building b2 success-building"></div>
                  <div className="mini-building b3 success-building"></div>

                  <div className="issue-dot dot-green"></div>
                  <div className="issue-dot dot-green dot-second"></div>
                </div>

                <div className="comparison-info">
                  <strong>4 Active Issues</strong>
                  <span>Faster action & better tracking</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="impact-progress-panel"
          >
            <div className="progress-panel-header">
              <div>
                <span>CITY PERFORMANCE</span>
                <h3>Resolution Progress</h3>
              </div>

              <ShieldCheck size={22} />
            </div>

            <div className="progress-list">
              <div className="progress-item">
                <div className="progress-top">
                  <span>Road Damage</span>
                  <strong>84%</strong>
                </div>

                <div className="progress-bar">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "84%" }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1.1,
                      delay: 0.1,
                    }}
                    className="progress-fill cyan-fill"
                  ></motion.div>
                </div>
              </div>

              <div className="progress-item">
                <div className="progress-top">
                  <span>Waste Management</span>
                  <strong>76%</strong>
                </div>

                <div className="progress-bar">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "76%" }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1.1,
                      delay: 0.2,
                    }}
                    className="progress-fill green-fill"
                  ></motion.div>
                </div>
              </div>

              <div className="progress-item">
                <div className="progress-top">
                  <span>Street Lighting</span>
                  <strong>91%</strong>
                </div>

                <div className="progress-bar">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "91%" }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1.1,
                      delay: 0.3,
                    }}
                    className="progress-fill purple-fill"
                  ></motion.div>
                </div>
              </div>

              <div className="progress-item">
                <div className="progress-top">
                  <span>Water Issues</span>
                  <strong>69%</strong>
                </div>

                <div className="progress-bar">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "69%" }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1.1,
                      delay: 0.4,
                    }}
                    className="progress-fill blue-fill"
                  ></motion.div>
                </div>
              </div>
            </div>

            <div className="progress-summary">
              <div>
                <span>Avg. Resolution Time</span>
                <strong>18.4 hrs</strong>
              </div>

              <div>
                <span>Citizen Satisfaction</span>
                <strong>92%</strong>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;