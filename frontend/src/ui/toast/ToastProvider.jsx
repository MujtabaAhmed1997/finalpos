import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import "./toast.css";

const ToastContext = createContext(null);

function id() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timeoutsRef = useRef(new Map());

  const removeToast = useCallback((toastId) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
    const t = timeoutsRef.current.get(toastId);
    if (t) clearTimeout(t);
    timeoutsRef.current.delete(toastId);
  }, []);

  const push = useCallback(
    ({ type = "info", title, message, durationMs = 3200 } = {}) => {
      const toastId = id();
      const toast = { id: toastId, type, title, message };
      setToasts((prev) => [toast, ...prev].slice(0, 4));

      if (durationMs > 0) {
        const t = setTimeout(() => removeToast(toastId), durationMs);
        timeoutsRef.current.set(toastId, t);
      }

      return toastId;
    },
    [removeToast]
  );

  const api = useMemo(
    () => ({
      push,
      remove: removeToast,
      success: (message, opts) => push({ type: "success", message, ...opts }),
      error: (message, opts) => push({ type: "error", message, ...opts }),
      info: (message, opts) => push({ type: "info", message, ...opts }),
      warning: (message, opts) => push({ type: "warning", message, ...opts }),
    }),
    [push, removeToast]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="app-toast-viewport" aria-live="polite" aria-relevant="additions">
        {toasts.map((t) => (
          <div key={t.id} className={`app-toast app-toast--${t.type}`} role="status">
            <div className="app-toast__body">
              {t.title ? <div className="app-toast__title">{t.title}</div> : null}
              {t.message ? <div className="app-toast__message">{t.message}</div> : null}
            </div>
            <button className="app-toast__close" onClick={() => removeToast(t.id)} aria-label="Close">
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}

