'use client';

import React from "react";

type ErrorStateProps = {
  message?: string;
  retry?: () => void;
};

export default function ErrorState({
  message = "Something went wrong",
  retry,
}: ErrorStateProps) {
  return (
    <div style={container}>
      <div style={text}>{message}</div>

      {retry && (
        <button style={button} onClick={retry}>
          Retry
        </button>
      )}
    </div>
  );
}

const container: React.CSSProperties = {
  color: "#991b1b",
  background: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: 12,
  padding: 12,
  marginTop: 12,
  fontSize: 13,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
};

const text: React.CSSProperties = {
  flex: 1,
};

const button: React.CSSProperties = {
  border: "none",
  background: "#111827",
  color: "#ffffff",
  borderRadius: 10,
  padding: "6px 10px",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
};
