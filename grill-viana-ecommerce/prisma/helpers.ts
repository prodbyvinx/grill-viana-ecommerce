const schema = process.env.VERCEL_ENV === "preview"
  ? `sch_${process.env.VERCEL_GIT_COMMIT_SHA?.slice(0,8)}`
  : "public";

export const dbUrl = `${process.env.DATABASE_URL!}&schema=${schema}`;