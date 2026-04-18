export default function LoadingBlock({ label = "Loading..." }) {
  return (
    <div className="loading-block" role="status" aria-live="polite">
      <span className="loading-dot" />
      <span>{label}</span>
    </div>
  );
}
