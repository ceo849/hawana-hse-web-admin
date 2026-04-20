"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        padding: 12,
        background: pending ? "#555" : "#111",
        color: "#fff",
        borderRadius: 10,
        opacity: pending ? 0.7 : 1,
        cursor: pending ? "not-allowed" : "pointer",
        border: "none",
      }}
    >
      {pending ? "Creating..." : "Create"}
    </button>
  );
}