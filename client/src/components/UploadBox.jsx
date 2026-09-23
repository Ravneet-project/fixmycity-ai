import {
  UploadCloud,
  ImagePlus,
  Camera,
  Images,
  X,
  RotateCcw,
  Check,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

const UploadBox = ({
  image,
  onImageChange,
}) => {
  const videoRef =
    useRef(null);

  const canvasRef =
    useRef(null);

  const streamRef =
    useRef(null);

  const [cameraOpen, setCameraOpen] =
    useState(false);

  const [cameraError, setCameraError] =
    useState("");

  const [capturedImage, setCapturedImage] =
    useState(null);

  // =========================================
  // OPEN CAMERA
  // =========================================

  const openCamera = async () => {
    try {
      setCameraError("");
      setCapturedImage(null);

      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        setCameraError(
          "Camera access is not supported in this browser."
        );

        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
          },
          audio: false,
        });

      streamRef.current =
        stream;

      setCameraOpen(true);

      setTimeout(() => {
        if (
          videoRef.current
        ) {
          videoRef.current.srcObject =
            stream;

          videoRef.current.play();
        }
      }, 100);
    } catch (error) {
      console.error(
        "Camera error:",
        error
      );

      if (
        error.name ===
        "NotAllowedError"
      ) {
        setCameraError(
          "Camera permission denied. Please allow camera access in your browser."
        );
      } else if (
        error.name ===
        "NotFoundError"
      ) {
        setCameraError(
          "No camera was found on this device."
        );
      } else if (
        error.name ===
        "NotReadableError"
      ) {
        setCameraError(
          "Camera is currently being used by another application."
        );
      } else {
        setCameraError(
          "Unable to open camera. Please check your browser permissions."
        );
      }
    }
  };

  // =========================================
  // CLOSE CAMERA
  // =========================================

  const closeCamera = () => {
    if (
      streamRef.current
    ) {
      streamRef.current
        .getTracks()
        .forEach(
          (track) =>
            track.stop()
        );

      streamRef.current =
        null;
    }

    if (
      videoRef.current
    ) {
      videoRef.current.srcObject =
        null;
    }

    setCameraOpen(false);

    setCapturedImage(null);

    setCameraError("");
  };

  // =========================================
  // CAPTURE PHOTO
  // =========================================

  const capturePhoto = () => {
    const video =
      videoRef.current;

    const canvas =
      canvasRef.current;

    if (
      !video ||
      !canvas
    ) {
      return;
    }

    const width =
      video.videoWidth;

    const height =
      video.videoHeight;

    if (
      !width ||
      !height
    ) {
      return;
    }

    canvas.width =
      width;

    canvas.height =
      height;

    const context =
      canvas.getContext(
        "2d"
      );

    context.drawImage(
      video,
      0,
      0,
      width,
      height
    );

    const imageData =
      canvas.toDataURL(
        "image/jpeg",
        0.9
      );

    setCapturedImage(
      imageData
    );
  };

  // =========================================
  // RETAKE
  // =========================================

  const retakePhoto = () => {
    setCapturedImage(
      null
    );
  };

  // =========================================
  // USE CAPTURED PHOTO
  // =========================================

  const useCapturedPhoto =
    async () => {
      if (
        !capturedImage
      ) {
        return;
      }

      const response =
        await fetch(
          capturedImage
        );

      const blob =
        await response.blob();

      const file =
        new File(
          [blob],
          `camera-civic-issue-${Date.now()}.jpg`,
          {
            type:
              "image/jpeg",
          }
        );

      const fakeEvent = {
        target: {
          files: [
            file,
          ],
        },
      };

      onImageChange(
        fakeEvent
      );

      closeCamera();
    };

  // =========================================
  // CLEANUP
  // =========================================

  useEffect(() => {
    return () => {
      if (
        streamRef.current
      ) {
        streamRef.current
          .getTracks()
          .forEach(
            (track) =>
              track.stop()
          );
      }
    };
  }, []);

  return (
    <>
      <div className="upload-box">
        {!image ? (
          <div className="upload-label">
            <div className="upload-icon">
              <UploadCloud
                size={30}
              />
            </div>

            <h3>
              Upload Issue Photo
            </h3>

            <p>
              Capture a fresh photo
              using your webcam or
              upload an existing image
              from your device.
            </p>

            <span>
              JPG, PNG, WEBP supported
            </span>

            <div className="upload-actions">
              <button
                type="button"
                className="camera-upload-btn"
                onClick={
                  openCamera
                }
              >
                <Camera
                  size={17}
                />

                Open Camera
              </button>

              <label className="gallery-upload-btn">
                <Images
                  size={17}
                />

                Choose From Device

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    onImageChange
                  }
                />
              </label>
            </div>

            {cameraError && (
              <div className="camera-error-message">
                {
                  cameraError
                }
              </div>
            )}
          </div>
        ) : (
          <div className="image-preview-wrapper">
            <img
              src={
                image
              }
              alt="Uploaded civic issue"
              className="uploaded-image"
            />

            <div className="image-overlay">
              <ImagePlus
                size={18}
              />

              Image Ready for AI Analysis
            </div>

            <div className="image-change-actions">
              <button
                type="button"
                className="change-camera-btn"
                onClick={
                  openCamera
                }
              >
                <Camera
                  size={15}
                />

                Retake Photo
              </button>

              <label className="change-gallery-btn">
                <Images
                  size={15}
                />

                Change Image

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    onImageChange
                  }
                />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* ===============================
          CAMERA MODAL
      =============================== */}

      {cameraOpen && (
        <div className="camera-modal-backdrop">
          <div className="camera-modal">
            <div className="camera-modal-header">
              <div>
                <span>
                  LIVE CAMERA
                </span>

                <h3>
                  Capture Civic Issue
                </h3>
              </div>

              <button
                type="button"
                className="camera-close-btn"
                onClick={
                  closeCamera
                }
              >
                <X
                  size={20}
                />
              </button>
            </div>

            <div className="camera-preview-area">
              {!capturedImage ? (
                <video
                  ref={
                    videoRef
                  }
                  autoPlay
                  playsInline
                  muted
                  className="camera-video"
                />
              ) : (
                <img
                  src={
                    capturedImage
                  }
                  alt="Captured civic issue"
                  className="camera-captured-image"
                />
              )}

              <div className="camera-live-badge">
                <span></span>

                {capturedImage
                  ? "CAPTURED"
                  : "LIVE"}
              </div>
            </div>

            <canvas
              ref={
                canvasRef
              }
              style={{
                display:
                  "none",
              }}
            />

            {!capturedImage ? (
              <button
                type="button"
                className="capture-photo-btn"
                onClick={
                  capturePhoto
                }
              >
                <Camera
                  size={20}
                />

                Capture Photo
              </button>
            ) : (
              <div className="camera-captured-actions">
                <button
                  type="button"
                  className="camera-retake-btn"
                  onClick={
                    retakePhoto
                  }
                >
                  <RotateCcw
                    size={17}
                  />

                  Retake
                </button>

                <button
                  type="button"
                  className="camera-use-photo-btn"
                  onClick={
                    useCapturedPhoto
                  }
                >
                  <Check
                    size={17}
                  />

                  Use This Photo
                </button>
              </div>
            )}

            <p className="camera-help-text">
              Keep the civic issue clearly
              visible before capturing the
              photo.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadBox;