// prisma.config.ts
import { defineConfig } from "prisma/config";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrate: {
    datasource: {
      url: process.env.DATABASE_URL!,
    },
  },
});