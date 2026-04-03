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
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
        aria-label="Close confirmation dialog"
        onClick={handleCancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Confirmation dialog"
        className="relative w-full max-w-md rounded-2xl border border-white/50 bg-white/10 p-6 text-white shadow-2xl backdrop-blur-2xl animate-fade-up"
      >
        <h3 className="text-xl font-semibold text-white">Please confirm</h3>
        <p className="mt-2 text-sm text-white/90">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-md border border-white/55 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-md bg-[#4285f4] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#3367d6]"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
