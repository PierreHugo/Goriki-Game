import { useState, useRef, useEffect } from "react";

const PLACEHOLDERS = {
  fr: "Tape un nom de Pokémon...",
  en: "Type a Pokémon name...",
  ja: "ポケモンの名前を入力...",
};

export default function InputGuess({ onSubmit, language }) {
  const [value, setValue] = useState("");
  const [flash, setFlash] = useState(null); // "success" | "error" | null
  const inputRef = useRef(null);

  // Focus auto au montage
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const raw = e.target.value;
    setValue(raw);

    // Tentative de devin à chaque frappe (pas besoin d'appuyer Entrée)
    if (raw.trim().length < 2) return;

    const success = onSubmit(raw.trim());
    if (success) {
      setValue("");
      triggerFlash("success");
    }
  };

  const triggerFlash = (type) => {
    setFlash(type);
    setTimeout(() => setFlash(null), 600);
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
    </div>
  );
}
