"use client";

import { useEffect, useRef, useState } from "react";

export function ConfirmFormSubmits() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const pendingFormRef = useRef<HTMLFormElement | null>(null);
  const pendingSubmitterRef = useRef<HTMLElement | null>(null);
  const approvedFormsRef = useRef(new WeakSet<HTMLFormElement>());

  useEffect(() => {
    const handler = (event: Event) => {
      const form = event.target;

      if (!(form instanceof HTMLFormElement)) {
        return;
      }

      if (approvedFormsRef.current.has(form)) {
        approvedFormsRef.current.delete(form);
        return;
      }

      const message = form.dataset.confirmMessage;
      if (!message) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      pendingFormRef.current = form;
      if (event instanceof SubmitEvent && event.submitter instanceof HTMLElement) {
        pendingSubmitterRef.current = event.submitter;
      } else {
        pendingSubmitterRef.current = null;
      }
      setMessage(message);
      setOpen(true);
    };

    document.addEventListener("submit", handler, true);
    return () => {
      document.removeEventListener("submit", handler, true);
    };
  }, []);

  const handleCancel = () => {
    setOpen(false);
    setMessage("");
    pendingFormRef.current = null;
    pendingSubmitterRef.current = null;
  };

  const handleConfirm = () => {
    const form = pendingFormRef.current;
    const submitter = pendingSubmitterRef.current;

    setOpen(false);
    setMessage("");
    pendingFormRef.current = null;
    pendingSubmitterRef.current = null;

    if (!form) {
      return;
    }

    approvedFormsRef.current.add(form);
    if (submitter instanceof HTMLButtonElement || submitter instanceof HTMLInputElement) {
      form.requestSubmit(submitter);
      return;
    }

    form.requestSubmit();
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-inkdeep/55 backdrop-blur-sm"
        aria-label="Close confirmation dialog"
        onClick={handleCancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Confirmation dialog"
        className="animate-fade-up relative w-full max-w-md rounded-[22px] border border-ink/10 bg-card p-7 shadow-[0_40px_80px_-40px_rgba(20,17,11,0.55)]"
      >
        <p className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.24em] text-clay">
          Please confirm
        </p>
        <p className="font-display text-[22px] font-bold leading-snug tracking-[-0.01em] text-ink">
          {message}
        </p>
        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex h-11 items-center rounded-full border-[1.5px] border-ink/15 px-5 text-[14px] font-semibold text-ink transition-colors hover:bg-[#f3ece0]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="inline-flex h-11 items-center rounded-full bg-clay px-6 text-[14px] font-bold text-paper transition-colors hover:bg-clay-dark"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
