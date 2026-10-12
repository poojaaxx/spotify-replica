export default function IconButton({
  icon: Icon,
  label,
  className = '',
  ...props
}) {
  return (
    <button
      type="button"
      className={`icon-button ${className}`}
      aria-label={label}
      title={label}
      {...props}
    >
      <Icon size={20} aria-hidden="true" />
    </button>
  );
}
