import LoadingState from "@/components/ui/loading-state";

export default function Loading() {
  return (
    <div style={container}>
      <LoadingState message="Loading users..." />
    </div>
  );
}

const container: React.CSSProperties = {
  padding: 16,
  maxWidth: 680,
  margin: "0 auto",
};