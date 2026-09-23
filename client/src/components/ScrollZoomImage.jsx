import {
  useRef,
} from "react";

import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

const ScrollZoomImage = ({
  src,
  alt = "FixMyCity civic issue",
}) => {
  const imageRef =
    useRef(null);

  const {
    scrollYProgress,
  } = useScroll({
    target: imageRef,

    offset: [
      "start end",
      "end start",
    ],
  });

  const scale =
    useTransform(
      scrollYProgress,
      [0, 0.5, 1],
      [0.86, 1.05, 1.14]
    );

  const y =
    useTransform(
      scrollYProgress,
      [0, 1],
      [70, -55]
    );

  const rotate =
    useTransform(
      scrollYProgress,
      [0, 0.5, 1],
      [-4, 0, 3]
    );

  const opacity =
    useTransform(
      scrollYProgress,
      [0, 0.15, 0.85, 1],
      [0.45, 1, 1, 0.65]
    );

  return (
    <div
      ref={imageRef}
      className="scroll-zoom-image-area"
    >
      <div className="scroll-image-glow"></div>

      <motion.div
        style={{
          scale,
          y,
          rotate,
          opacity,
        }}
        className="scroll-image-card"
      >
        <img
          src={src}
          alt={alt}
        />

        <div className="scroll-image-overlay"></div>

        <div className="scroll-image-live">
          <span></span>

          LIVE CIVIC ISSUE
        </div>

        <div className="scroll-image-info">
          <span>
            AI CIVIC VISION
          </span>

          <strong>
            Real-world issue detection
          </strong>
        </div>
      </motion.div>

      <div className="scroll-image-ring ring-one"></div>
      <div className="scroll-image-ring ring-two"></div>
    </div>
  );
};

export default ScrollZoomImage;