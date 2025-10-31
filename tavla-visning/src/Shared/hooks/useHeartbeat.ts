import { useEffect, useRef } from "react";
import type { BoardDB } from "../types/db-types/boards";

const HEARTBEAT_INTERVAL_MS = 60000; // 1 minute - how often to send heartbeat

declare global {
  interface Window {
    __tabId?: string;
  }
}

function safeUuidV4(): string {
  try {
    if (typeof window !== "undefined" && window.crypto) {
      if (typeof window.crypto.randomUUID === "function") {
        return window.crypto.randomUUID();
      }

      if (typeof window.crypto.getRandomValues === "function") {
        const bytes = new Uint8Array(16);
        window.crypto.getRandomValues(bytes);
        // Format bytes as UUIDv4
        if (
          bytes &&
          typeof bytes[6] !== "undefined" &&
          typeof bytes[8] !== "undefined" &&
          bytes.length >= 16
        ) {
          bytes[6] = (bytes[6] & 0x0f) | 0x40;
          bytes[8] = (bytes[8] & 0x3f) | 0x80;
          const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"));
          return (
            hex.slice(0, 4).join("") +
            "-" +
            hex.slice(4, 6).join("") +
            "-" +
            hex.slice(6, 8).join("") +
            "-" +
            hex.slice(8, 10).join("") +
            "-" +
            hex.slice(10, 16).join("")
          );
        }
      }
    }
  } catch {}

  //Fallback for old screens
  const hex = "0123456789abcdef";
  let uuid = "";
  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) uuid += "-";
    else if (i === 14) uuid += "4";
    else if (i === 19) uuid += hex[((Math.random() * 4) | 0) + 8];
    else uuid += hex[(Math.random() * 16) | 0];
  }
  return uuid;
}

interface FetchOptions {
  method: string;
  headers?: Record<string, string>;
  body: string;
}

type SafeResponse = { ok: boolean; status: number; text: string };

/**
 * Performs an HTTP request using XMLHttpRequest as a fallback when fetch is not available.
 * This function provides a Promise-based interface similar to fetch() but uses the older XHR API.
 *
 * @param url - The URL to send the request to
 * @param options - Request options including method, headers, and body
 * @returns A Promise that resolves to a SafeResponse object containing ok status, status code, and response text
 * @throws Will reject the promise if a network error occurs or if an exception is thrown during the request
 */
function xhrFetch(url: string, options: FetchOptions): Promise<SafeResponse> {
  return new Promise((resolve, reject) => {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open(options.method || "GET", url, true);

      const headers = options.headers || {};
      for (const k in headers) {
        if (Object.prototype.hasOwnProperty.call(headers, k)) {
          xhr.setRequestHeader(k, headers[k]!);
        }
      }

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          resolve({
            ok: xhr.status >= 200 && xhr.status < 300,
            status: xhr.status,
            text: xhr.responseText || "",
          });
        }
      };
      xhr.onerror = () => reject(new Error("Network error"));
      xhr.send(options.body || null);
    } catch (e) {
      reject(e);
    }
  });
}

async function safeFetch(
  url: string,
  options: FetchOptions
): Promise<SafeResponse> {
  if (typeof fetch !== "undefined") {
    return fetch(url, options).then(async (r) => ({
      ok: typeof r.ok === "boolean" ? r.ok : r.status >= 200 && r.status < 300,
      status: r.status,
      text: await r.text(),
    }));
  }

  return xhrFetch(url, options);
}

/**
 * Initializes and retrieves a unique tab ID for the current browser tab.
 * Tries to get existing ID from sessionStorage first, then creates a new one if needed.
 * Falls back to window.__tabId if sessionStorage is not available.
 *
 * @returns A unique tab ID string, or null if initialization fails
 */
function initializeTabId(): string {
  if (typeof window === "undefined") {
    return safeUuidV4();
  }

  try {
    const id = sessionStorage.getItem("tabId");
    if (id) {
      return id;
    }
  } catch {}

  const newId = safeUuidV4();

  try {
    sessionStorage.setItem("tabId", newId);
    return newId;
  } catch {
    // Fallback til window.__tabId hvis sessionStorage ikke er tilgjengelig
    window.__tabId = newId;
    return newId;
  }
}

/**
 * Checks if the current pathname should be excluded from heartbeat tracking.
 * Admin pages, edit pages, and demo pages are excluded.
 *
 * @returns true if heartbeat should be skipped for current path
 */
function shouldSkipHeartbeat(): boolean {
  if (typeof window === "undefined") return false;

  const pathname = window.location.pathname;
  return (
    pathname.includes("/admin/") ||
    pathname.includes("/rediger") ||
    pathname.includes("/demo")
  );
}

function sendHeartbeat(boardId: string, tabId: string, backend_url: string) {
  try {
    const screenInfo = {
      width: (window && window.screen && window.screen.width) || 0,
      height: (window && window.screen && window.screen.height) || 0,
    };
    const userAgent =
      (window && window.navigator && window.navigator.userAgent) || "Unknown";

    safeFetch(backend_url + "/heartbeat", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        bid: boardId,
        tid: tabId,
        browser: userAgent,
        screen_width: screenInfo.width,
        screen_height: screenInfo.height,
      }),
    });
  } catch {}
}

/**
 * Custom hook that sends periodic heartbeat signals to track active board viewers.
 * Automatically handles tab ID generation, excludes admin/edit pages, and manages cleanup.
 *
 * @param board - The board object containing the board ID to track
 */
export function useHeartbeat(board: BoardDB, backend_url: string) {
  const tabIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (tabIdRef.current === null) {
      tabIdRef.current = initializeTabId();
    }
  }, []);

  // Set up heartbeat interval for active board tracking
  useEffect(() => {
    if (!board || !board.id || shouldSkipHeartbeat() || !tabIdRef.current)
      return;

    sendHeartbeat(board.id, tabIdRef.current, backend_url);

    // Set up interval for subsequent heartbeats
    const intervalId = setInterval(() => {
      if (!board || !board.id || !tabIdRef.current) return;
      sendHeartbeat(board.id, tabIdRef.current, backend_url);
    }, HEARTBEAT_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, [board, backend_url]);
}
