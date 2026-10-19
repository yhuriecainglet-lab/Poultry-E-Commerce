// components/admin/Toast.tsx
// Simple inline toast for success/error feedback after admin actions.

import { useEffect } from "react";

interface Props {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export function Toast({ message, type, onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles =
    type === "success"
      ? "bg-success text-white border-success"
      : "bg-danger text-white border-danger";

  return (
    <div
      role="status"
      className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border ${styles} text-sm font-medium max-w-xs`}
    >
      {message}
    </div>
  );
}