// components/ui/success-state.tsx

type SuccessStateProps = {
  message: string;
};

export default function SuccessState({ message }: SuccessStateProps) {
  return (
    <div
      style={{
        color: "#065f46",
        background: "#ecfdf5",
        border: "1px solid #6ee7b7",
        borderRadius: 12,
        padding: 12,
        marginTop: 12,
        fontSize: 13,
        fontWeight: 500,
      }}
    >
      {message}
    </div>
  );
}