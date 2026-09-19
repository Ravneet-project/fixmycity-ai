const StatCard = ({
  icon,
  value,
  label,
  className = "",
}) => {
  return (
    <div className={`stat-card ${className}`}>
      <div className="stat-icon">
        {icon}
      </div>

      <div>
        <h3>{value}</h3>
        <p>{label}</p>
      </div>
    </div>
  );
};

export default StatCard;