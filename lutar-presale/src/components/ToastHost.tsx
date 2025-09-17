"use client";

import { useSnapshot } from "valtio";
import { toastState } from "@/state/toast";

export function ToastHost() {
  const snap = useSnapshot(toastState);
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {snap.toasts.map((t) => (
        <div key={t.id} className={`flex items-center gap-2 px-3 py-2 rounded shadow text-sm border ${t.kind === "success" ? "bg-green-600/20 border-green-500 text-green-200" : t.kind === "error" ? "bg-red-600/20 border-red-500 text-red-200" : "bg-white/10 border-white/20"}`}>
          <span>{t.kind === "success" ? "✓" : t.kind === "error" ? "⚠" : "ℹ"}</span>
          <span>{t.text}</span>
        </div>
      ))}
    </div>
  );
}

