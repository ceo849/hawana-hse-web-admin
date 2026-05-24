"use client";

import { useState } from "react";
import AuditLogModal from "@/components/audit-log-modal";
import { apiClient } from "@/src/lib/api-client";

export default function AuditLogsClient({
  logs,
  meta,
  page,
  q,
  from,
  to,
  actionFilter,
  entityFilter,
  sort,
  order,
}: any) {
  const [selectedLog, setSelectedLog] = useState<any>(null);

  const prevPage = Math.max(1, meta.page - 1);
  const nextPage = Math.min(Math.max(meta.totalPages, 1), meta.page + 1);

  if (!logs || logs.length === 0) {
    return <div>No logs found.</div>;
  }

  async function openLog(id: string) {
    try {
      const data = await apiClient.get(`/api/audit-log/${id}`);
      setSelectedLog(data);
    } catch (err) {
      console.error("Failed to fetch audit log:", err);
    }
  }

  return (
    <>
      {/* TABLE */}
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          padding: 10,
          overflowX: "auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(160px,1fr) minmax(260px,2fr) minmax(180px,1fr) minmax(120px,140px) minmax(160px,180px)",
            fontWeight: 600,
            minWidth: 980,
          }}
        >
          <div>Actor</div>
          <div>Action</div>
          <div>Target</div>
          <div>Entity</div>
          <div>Date</div>
        </div>

        {logs.map((log: any) => (
          <div
            key={log.id}
            onClick={() => openLog(log.id)}
            style={{
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "minmax(160px,1fr) minmax(260px,2fr) minmax(180px,1fr) minmax(120px,140px) minmax(160px,180px)",
                padding: "8px 0",
                borderTop: "1px solid #eee",
                minWidth: 980,
              }}
            >
              <div>
                {log.newData?.email ??
                  `User ${log.actorUserId?.slice(0, 6)}`}
              </div>

              <div>
                <div style={{ fontWeight: 700 }}>{log.action}</div>
              </div>

              <div>
                {log.newData?.fullName ??
                  `User ${log.entityId?.slice(0, 6)}`}
              </div>

              <div>{log.entity}</div>

              <div>
                {new Date(log.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedLog && (
        <div onClick={() => setSelectedLog(null)}>
          <AuditLogModal log={selectedLog} />
        </div>
      )}

      {/* PAGINATION */}
      <div
        style={{
          marginTop: 10,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <a href={`?page=${prevPage}`}>Prev</a>
        <span>Page {meta.page}</span>
        <a href={`?page=${nextPage}`}>Next</a>
      </div>
    </>
  );
}