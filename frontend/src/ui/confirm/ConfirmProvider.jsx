import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import "./confirm.css";

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [state, setState] = useState({
    open: false,
    title: "Confirm",
    description: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    tone: "danger",
    resolve: null,
  });

  const confirm = useCallback(
    ({ title, description, confirmText, cancelText, tone } = {}) =>
      new Promise((resolve) => {
        setState({
          open: true,
          title: title || "Confirm",
          description: description || "",
          confirmText: confirmText || "Confirm",
          cancelText: cancelText || "Cancel",
          tone: tone || "danger",
          resolve,
        });
      }),
    []
  );

  const close = useCallback(() => {
    setState((s) => ({ ...s, open: false, resolve: null }));
  }, []);

  const onCancel = useCallback(() => {
    if (state.resolve) state.resolve(false);
    close();
  }, [close, state.resolve]);

  const onConfirm = useCallback(() => {
    if (state.resolve) state.resolve(true);
    close();
  }, [close, state.resolve]);

  const api = useMemo(() => ({ confirm }), [confirm]);

  return (
    <ConfirmContext.Provider value={api}>
      {children}
      {state.open ? (
        <div className="app-confirm__overlay" role="dialog" aria-modal="true">
          <div className="app-confirm__modal">
            <div className="app-confirm__header">
              <div className="app-confirm__title">{state.title}</div>
            </div>
            {state.description ? <div className="app-confirm__body">{state.description}</div> : null}
            <div className="app-confirm__actions">
              <button className="app-confirm__btn app-confirm__btn--ghost" onClick={onCancel}>
                {state.cancelText}
              </button>
              <button
                className={`app-confirm__btn app-confirm__btn--${state.tone === "primary" ? "primary" : "danger"}`}
                onClick={onConfirm}
              >
                {state.confirmText}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used inside ConfirmProvider");
  return ctx;
}

