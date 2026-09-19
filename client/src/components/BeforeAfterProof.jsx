import { useState } from "react";
import { motion } from "framer-motion";

import {
  Image as ImageIcon,
  CheckCircle2,
  MoveHorizontal,
} from "lucide-react";

const BeforeAfterProof = ({
  beforeImage,
  afterImage,
}) => {
  const [position, setPosition] =
    useState(50);

  if (!beforeImage || !afterImage) {
    return null;
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="before-after-card"
    >
      <div className="before-after-header">
        <div>
          <span>
            RESOLUTION PROOF
          </span>

          <h3>
            Before & After
          </h3>
        </div>

        <div className="proof-verified">
          <CheckCircle2 size={15} />
          Verified Fix
        </div>
      </div>

      <div className="before-after-container">
        <img
          src={afterImage}
          alt="Resolved civic issue"
          className="after-image"
        />

        <div
          className="before-image-wrapper"
          style={{
            width: `${position}%`,
          }}
        >
          <img
            src={beforeImage}
            alt="Original civic issue"
            className="before-image"
          />
        </div>

        <div
          className="before-label"
        >
          BEFORE
        </div>

        <div
          className="after-label"
        >
          AFTER
        </div>

        <div
          className="before-after-divider"
          style={{
            left: `${position}%`,
          }}
        >
          <div className="slider-handle">
            <MoveHorizontal
              size={18}
            />
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={(e) =>
            setPosition(
              Number(
                e.target.value
              )
            )
          }
          className="before-after-range"
          aria-label="Compare before and after images"
        />
      </div>

      <div className="proof-footer">
        <ImageIcon size={15} />

        <span>
          Drag the slider to compare the reported
          issue with the completed civic work.
        </span>
      </div>
    </motion.div>
  );
};

export default BeforeAfterProof;