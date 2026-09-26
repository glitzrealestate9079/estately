import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Reference-only static prototype being ported into this app — not part
    // of the Next.js build, not meant to be linted/fixed in place.
    "Real Estate Project/**",
  ]),
]);

export default eslintConfig;
