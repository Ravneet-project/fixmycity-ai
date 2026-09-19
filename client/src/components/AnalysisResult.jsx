import {
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  MapPin,
  ShieldAlert,
} from "lucide-react";

const AnalysisResult = ({ result }) => {
  if (!result) return null;

  const getSeverityClass = () => {
    switch (result.severity?.toLowerCase()) {
      case "high":
        return "severity-high";

      case "medium":
        return "severity-medium";

      case "low":
        return "severity-low";

      default:
        return "";
    }
  };

  return (
    <div className="analysis-result">
      <div className="analysis-result-header">
        <div className="ai-result-icon">
          <BrainCircuit size={22} />
        </div>

        <div className="analysis-result-title">
          <span>AI Analysis Complete</span>

          <strong>
            {result.issue}
          </strong>
        </div>

        <div className="confidence-badge">
          {result.confidence}% Match
        </div>
      </div>

      <div className="ai-confidence-meter">
        <div className="confidence-meter-top">
          <span>
            AI Confidence
          </span>

          <strong>
            {result.confidence}%
          </strong>
        </div>

        <div className="confidence-meter-track">
          <div
            className="confidence-meter-fill"
            style={{
              width: `${result.confidence}%`,
            }}
          ></div>
        </div>
      </div>

      <div className="analysis-grid">
        <div className="analysis-item">
          <span className="analysis-label">
            Category
          </span>

          <strong>
            {result.category}
          </strong>
        </div>

        <div className="analysis-item">
          <span className="analysis-label">
            Severity
          </span>

          <strong
            className={getSeverityClass()}
          >
            <AlertTriangle size={15} />

            {result.severity}
          </strong>
        </div>

        <div className="analysis-item">
          <span className="analysis-label">
            Priority
          </span>

          <strong>
            <ShieldAlert size={15} />

            {result.priority}
          </strong>
        </div>

        <div className="analysis-item">
          <span className="analysis-label">
            Location
          </span>

          <strong>
            <MapPin size={15} />

            Auto Detected
          </strong>
        </div>
      </div>

      <div className="analysis-summary">
        <CheckCircle2 size={18} />

        <p>
          {result.description}
        </p>
      </div>
    </div>
  );
};

export default AnalysisResult