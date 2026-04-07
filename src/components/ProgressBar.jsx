export default function ProgressBar({ stats, language }) {
  const { found, total, percent } = stats;
  const isFr = language !== "en" && language !== "ja";

  return (
    <div className="progress-bar-wrapper">
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="progress-label">
        <span className="progress-found">{found}</span>
        <span className="progress-sep"> / </span>
        <span className="progress-total">{total}</span>
        <span className="progress-percent"> — {percent}%</span>
        {found === total && total > 0 && (
          <span className="progress-complete">
            {isFr ? " 🎉 Tous trouvés !" : " 🎉 All found!"}
          </span>
        )}
      </p>
    </div>
  );
}
