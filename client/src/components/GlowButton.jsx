const GlowButton = ({
  children,
  variant = "primary",
  icon,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`glow-button glow-button-${variant}`}
    >
      <span>{children}</span>

      {icon && (
        <span className="glow-button-icon">
          {icon}
        </span>
      )}
    </button>
  );
};

export default GlowButton;