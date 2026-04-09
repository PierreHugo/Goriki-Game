import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";

const PLACEHOLDERS = {
  fr: "Tape un nom de Pokémon...",
  en: "Type a Pokémon name...",
};

const ALREADY_LABELS = {
  fr: "Déjà trouvé !",
  en: "Already found!",
};

const InputGuess = forwardRef(({ onSubmit, language }, ref) => {
  const [value, setValue] = useState("");
  const [flash, setFlash] = useState(null); // "success" | "already" | null
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
  }));

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const raw = e.target.value;
    setValue(raw);
    if (raw.trim().length < 2) return;

    const result = onSubmit(raw.trim());
    if (result === "success") {
      setValue("");
      triggerFlash("success");
    } else if (result === "already") {
      triggerFlash("already");
    }
  };

  const triggerFlash = (type) => {
    setFlash(type);
    setTimeout(() => setFlash(null), 800);
  };

  return (
    <div className={`input-guess-wrapper ${flash ?? ""}`}>
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
    </div>
  );
});

InputGuess.displayName = "InputGuess";

export default InputGuess;
