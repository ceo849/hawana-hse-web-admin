"use client";

import { useFormStatus } from "react-dom";

type FormSubmitButtonProps = {
  idleText: string;
  pendingText?: string;
};

export default function FormSubmitButton({
  idleText,
  pendingText,
}: FormSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        height: 42,
        padding: "0 16px",
        borderRadius: 10,
        border: "none",
        background: pending ? "#6b7280" : "#111827",
        color: "#ffffff",
        fontWeight: 600,
        cursor: pending ? "not-allowed" : "pointer",
        opacity: pending ? 0.9 : 1,
        transition: "background 0.15s ease, opacity 0.15s ease",
      }}
    >
      {pending ? pendingText ?? "Saving..." : idleText}
    </button>
  );
}