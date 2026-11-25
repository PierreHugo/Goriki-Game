import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";

const PLACEHOLDERS = {
  fr: "Tape un nom de Pokémon...",
  en: "Type a Pokémon name...",
};

const ALREADY_LABELS = {
  fr: "Déjà trouvé !",
  en: "Already found!",
};

const CLOSE_LABELS = {
  fr: "Tu y es presque !",
  en: "Almost there!",
};

const CLOSE_DELAY_MS = 300;

const InputGuess = forwardRef(({ onSubmit, onCheckClose, language }, ref) => {
  const [value, setValue] = useState("");
  const [flash, setFlash] = useState(null); // "success" | "already" | null
  const [close, setClose] = useState(false);
  const inputRef = useRef(null);
  const closeTimer = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
  }));

  useEffect(() => {
    inputRef.current?.focus();
    return () => clearTimeout(closeTimer.current);
  }, []);

  const handleChange = (e) => {
    const raw = e.target.value;
    setValue(raw);
    setClose(false);
    clearTimeout(closeTimer.current);
    if (raw.trim().length < 2) return;

    const result = onSubmit(raw.trim());
    if (result === "success") {
      setValue("");
      triggerFlash("success");
      return;
    }
    if (result === "already") {
      triggerFlash("already");
      return;
    }

    // Pas de match : on attend que le joueur s'arrête de taper
    closeTimer.current = setTimeout(() => {
      if (onCheckClose?.(raw.trim())) setClose(true);
    }, CLOSE_DELAY_MS);
  };

  const triggerFlash = (type) => {
    setFlash(type);
    setTimeout(() => setFlash(null), 800);
  };

  return (
    <div className={`input-guess-wrapper ${flash ?? ""} ${close && !flash ? "close" : ""}`}>
      <input
        ref={inputRef}
        type="text"
        className="input-guess"
        placeholder={PLACEHOLDERS[language] ?? PLACEHOLDERS.fr}
        value={value}
        onChange={handleChange}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />
      {flash === "success" && (
        <span className="input-badge success">✓</span>
      )}
      {flash === "already" && (
        <span className="input-badge already">
          {ALREADY_LABELS[language] ?? ALREADY_LABELS.fr}
        </span>
      )}
      {close && !flash && (
        <span className="input-badge close">
          {CLOSE_LABELS[language] ?? CLOSE_LABELS.fr}
        </span>
      )}
    </div>
  );
});

InputGuess.displayName = "InputGuess";

export default InputGuess;