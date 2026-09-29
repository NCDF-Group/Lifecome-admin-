// Re-exports (and narrows, where a page only needs part of a schema) the
// types generated into `src/lib/api/generated/schema.d.ts` by
// `npm run generate:api`. Prefer importing from here over the generated
// file directly, so a backend contract change surfaces as one file's diff.
export {};
