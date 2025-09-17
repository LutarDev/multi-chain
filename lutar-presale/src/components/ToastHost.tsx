"use client";

import { useSnapshot } from "valtio";
import { toastState } from "@/state/toast";

export function ToastHost() {
  const snap = useSnapshot(toastState);
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {snap.toasts.map((t) => (
        <div key={t.id} className={`px-3 py-2 rounded shadow text-sm ${t.kind === "success" ? "bg-green-600" : t.kind === "error" ? "bg-red-600" : "bg-white/10"}`}>
          {t.text}
        </div>
      ))}
    </div>
  );
}

