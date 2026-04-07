import { formatTime } from "../hooks/useTimer";

const PRESETS = [
  { label: "5 min",  seconds: 5 * 60 },
  { label: "10 min", seconds: 10 * 60 },
  { label: "20 min", seconds: 20 * 60 },
  { label: "30 min", seconds: 30 * 60 },
  { label: "1 h",    seconds: 60 * 60 },
];

export default function TimerSetup({ options, setOptions }) {
  const { timerSeconds, infinite, language } = options;
  const isFr = language !== "en" && language !== "ja";

  const update = (key, value) =>
    setOptions((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="timer-setup">
      <div className="filter-header">
        <h2 className="filter-title">
          {isFr ? "Durée" : "Duration"}
        </h2>

        {/* Toggle mode infini */}
        <label className="infinite-toggle">
          <input
            type="checkbox"
            checked={infinite}
            onChange={(e) => update("infinite", e.target.checked)}
          />
          <span>{isFr ? "Mode infini" : "No limit"}</span>
        </label>
      </div>

      {!infinite && (
        <>
          {/* Presets */}
          <div className="filter-chips">
            {PRESETS.map((p) => (
              <button
                key={p.seconds}
                className={`chip ${timerSeconds === p.seconds ? "active" : ""}`}
                onClick={() => update("timerSeconds", p.seconds)}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Slider custom */}
          <div className="timer-slider-row">
            <input
              type="range"
              min={60}
              max={3600}
              step={60}
              value={timerSeconds}
              onChange={(e) => update("timerSeconds", Number(e.target.value))}
              className="timer-slider"
            />
            <span className="timer-value">{formatTime(timerSeconds)}</span>
          </div>
        </>
      )}
    </div>
  );
}
