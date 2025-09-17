"use client";

import { proxy } from "valtio";

export type Toast = { id: string; kind: "success" | "error" | "info"; text: string };

export const toastState = proxy<{ toasts: Toast[] }>({ toasts: [] });

export function pushToast(kind: Toast["kind"], text: string) {
  const t: Toast = { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, kind, text };
  toastState.toasts.unshift(t);
  setTimeout(() => {
    const idx = toastState.toasts.findIndex((x) => x.id === t.id);
    if (idx >= 0) toastState.toasts.splice(idx, 1);
  }, 4000);
}

