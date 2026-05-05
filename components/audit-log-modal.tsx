"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { CSSProperties } from "react";

export default function AuditLogModal({ log }: { log: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!log) return null;

  function closeModal() {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("logId"); // ✅ remove modal state

    router.push(`?${params.toString()}`); // ✅ deterministic navigation
  }

  return (
    <div
      style={overlay}
      onClick={closeModal} // ✅ click outside
    >
      <div
        style={modal}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Audit Log Details</h3>

        <pre style={pre}>
          {JSON.stringify(log, null, 2)}
        </pre>

        <button onClick={closeModal} style={btn}>
          Close
        </button>
      </div>
    </div>
  );
}

/* styles */

const overlay: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modal: CSSProperties = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  width: "90%",
  maxWidth: 600,
};

const pre: CSSProperties = {
  background: "#f3f4f6",
  padding: 10,
  borderRadius: 8,
  maxHeight: 400,
  overflow: "auto",
};

const btn: CSSProperties = {
  marginTop: 10,
};