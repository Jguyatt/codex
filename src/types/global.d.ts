export {};

declare global {
  interface ClarifileTauri {
    invoke: <T = unknown>(cmd: string, args?: Record<string, unknown>) => Promise<T>;
  }

  interface Window {
    __TAURI__?: ClarifileTauri;
  }
}
