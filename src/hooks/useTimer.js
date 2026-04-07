import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Hook de gestion du timer
 *
 * @param {number} initialSeconds - Durée initiale en secondes
 * @param {boolean} infinite - Si true, le timer ne décompte pas
 * @param {function} onExpire - Callback appelé quand le timer atteint 0
 */
export function useTimer(initialSeconds, infinite, onExpire) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const onExpireRef = useRef(onExpire);

  // Garde la ref à jour sans recréer l'effet
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  // Décompte
  useEffect(() => {
    if (!running || infinite) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          onExpireRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [running, infinite]);

  const start = useCallback(() => {
    setSecondsLeft(initialSeconds);
    setRunning(true);
  }, [initialSeconds]);

  const pause = useCallback(() => {
    setRunning(false);
  }, []);

  const resume = useCallback(() => {
    setRunning(true);
  }, []);

  const reset = useCallback(() => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  // Formatage mm:ss
  const formatted = formatTime(secondsLeft);

  // Pourcentage restant (pour une éventuelle barre de timer)
  const ratio = infinite ? 1 : secondsLeft / initialSeconds;

  // Alerte visuelle quand il reste moins de 60s
  const isUrgent = !infinite && secondsLeft <= 60 && running;

  return {
    secondsLeft,
    formatted,
    ratio,
    running,
    isUrgent,
    start,
    pause,
    resume,
    reset,
  };
}

/**
 * Convertit des secondes en string "mm:ss"
 */
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
