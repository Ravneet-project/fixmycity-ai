import { UploadCloud, ImagePlus } from "lucide-react";

const UploadBox = ({ image, onImageChange }) => {
  return (
    <div className="upload-box">
      {!image ? (
        <label className="upload-label">
          <input
            type="file"
            accept="image/*"
            onChange={onImageChange}
          />

          <div className="upload-icon">
            <UploadCloud size={30} />
          </div>

          <h3>Upload Issue Photo</h3>

          <p>
            Drag & drop or click to upload pothole,
            garbage, streetlight or water leakage image.
          </p>

          <span>
            JPG, PNG, WEBP supported
          </span>
        </label>
      ) : (
        <div className="image-preview-wrapper">
          <img
            src={image}
            alt="Uploaded civic issue"
            className="uploaded-image"
          />

          <div className="image-overlay">
            <ImagePlus size={18} />
            Image Ready for AI Analysis
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadBox;