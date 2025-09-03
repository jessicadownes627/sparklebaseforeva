export const newsdataApiKey =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_NEWSDATA_API_KEY) ||
  (typeof process !== "undefined" && process.env?.VITE_NEWSDATA_API_KEY) ||
  "";
