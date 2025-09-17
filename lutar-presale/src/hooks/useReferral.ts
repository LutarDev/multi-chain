"use client";

import { useEffect, useState } from "react";

const REF_KEY = "lutar_ref_code";

export function useReferral() {
  const [ref, setRef] = useState<string | null>(null);
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const fromUrl = url.searchParams.get("ref");
      const stored = localStorage.getItem(REF_KEY);
      if (fromUrl) {
        localStorage.setItem(REF_KEY, fromUrl);
        setRef(fromUrl);
      } else if (stored) {
        setRef(stored);
      }
    } catch {}
  }, []);
  return ref;
}

