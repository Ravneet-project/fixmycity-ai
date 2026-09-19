import { motion } from "framer-motion";
import {
  Building2,
  MapPin,
  Navigation,
} from "lucide-react";

const RoutingMap = ({
  coordinates,
  department,
}) => {
  if (!coordinates || !department) {
    return null;
  }

  return (
    <div className="routing-map-card">
      <div className="routing-map-header">
        <div>
          <span>
            SMART CIVIC ROUTING
          </span>

          <h3>
            Complaint Route
          </h3>
        </div>

        <div className="routing-live">
          <i></i>
          Active
        </div>
      </div>

      <div className="routing-map">
        <div className="routing-grid"></div>

        <div className="routing-road routing-road-a"></div>
        <div className="routing-road routing-road-b"></div>
        <div className="routing-road routing-road-c"></div>
        <div className="routing-road routing-road-d"></div>

        <div className="routing-block rb1"></div>
        <div className="routing-block rb2"></div>
        <div className="routing-block rb3"></div>
        <div className="routing-block rb4"></div>
        <div className="routing-block rb5"></div>

        <svg
          className="routing-svg"
          viewBox="0 0 1000 500"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="routeGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="0%"
                stopColor="#13e9ef"
              />

              <stop
                offset="100%"
                stopColor="#58f495"
              />
            </linearGradient>
          </defs>

          <motion.path
            d="
              M 220 340
              C 350 290,
                410 185,
                540 215
              S 690 335,
                790 150
            "
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="12 12"
            initial={{
              pathLength: 0,
              opacity: 0,
            }}
            animate={{
              pathLength: 1,
              opacity: 1,
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
            }}
          />
        </svg>

        <motion.div
          initial={{
            scale: 0,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          transition={{
            delay: 0.3,
            type: "spring",
          }}
          className="routing-marker citizen-marker"
        >
          <div className="marker-pulse"></div>

          <MapPin size={20} />

          <div className="routing-marker-label">
            <strong>
              Issue Location
            </strong>

            <span>
              {coordinates.latitude.toFixed(4)},
              {" "}
              {coordinates.longitude.toFixed(4)}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{
            scale: 0,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          transition={{
            delay: 1.3,
            type: "spring",
          }}
          className="routing-marker department-marker"
        >
          <div className="marker-pulse"></div>

          <Building2 size={20} />

          <div className="routing-marker-label department-label">
            <strong>
              Assigned Department
            </strong>

            <span>
              {department.name}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{
            left: "22%",
            top: "68%",
          }}
          animate={{
            left: [
              "22%",
              "42%",
              "55%",
              "68%",
              "79%",
            ],

            top: [
              "68%",
              "50%",
              "42%",
              "55%",
              "30%",
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatDelay: 1,
            ease: "easeInOut",
          }}
          className="route-moving-dot"
        ></motion.div>

        <div className="routing-center-glow"></div>
      </div>

      <div className="routing-info-grid">
        <div>
          <Navigation size={16} />

          <span>
            Route Distance
          </span>

          <strong>
            {department.distance} km
          </strong>
        </div>

        <div>
          <Building2 size={16} />

          <span>
            Department
          </span>

          <strong>
            {department.name}
          </strong>
        </div>

        <div>
          <MapPin size={16} />

          <span>
            Routing
          </span>

          <strong>
            Auto Assigned
          </strong>
        </div>
      </div>
    </div>
  );
};

export default RoutingMap;