import { headers } from "next/headers";

export function getBaseUrl() {
  // 1) Preview/Prod na Vercel
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  // 2) Dev local
  const host = headers().get("host");
  return host ? `http://${host}` : "http://localhost:3000";
}
