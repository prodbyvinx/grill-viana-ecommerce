import { execSync } from "node:child_process";
const isProd = process.env.VERCEL_ENV === "production";

execSync("prisma generate", { stdio: "inherit" });
if (isProd) {
  execSync("prisma migrate deploy", { stdio: "inherit" });
} else {
  execSync("prisma db push --accept-data-loss", { stdio: "inherit" });
}
execSync("next build", { stdio: "inherit" });