"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface CopyState {
  copiedKey: string | null;
  errorMsg: string | null;
  copyText: (text: string, key: string) => Promise<boolean>;
  clearError: () => void;
}

export function useCopyClipboard(): CopyState {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const markCopied = useCallback((key: string) => {
    setErrorMsg(null);
    setCopiedKey(key);
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setCopiedKey((current) => (current === key ? null : current));
    }, 2000);
  }, []);

  const copyText = useCallback(
    async (text: string, key: string) => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
          markCopied(key);
          return true;
        }
      } catch {
        // Fallback to textarea copy below
      }

      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        textarea.style.pointerEvents = "none";
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (ok) {
          markCopied(key);
          return true;
        }
      } catch {
        // Handled by error message below
      }

      setErrorMsg(
        "Copy failed because clipboard permission is blocked. Use the Select code button and press Ctrl+C."
      );
      return false;
    },
    [markCopied]
  );

  const clearError = useCallback(() => setErrorMsg(null), []);

  return { copiedKey, errorMsg, copyText, clearError };
}
