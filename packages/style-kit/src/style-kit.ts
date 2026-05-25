import type { StyleKitOptions } from "./types.js";

export const styleKit = (
  _options: StyleKitOptions = {},
): { oxfmt: unknown; oxlint: unknown } => {
  throw new Error("styleKit: not implemented yet — see T11 in docs/OXLINT_MIGRATION.md");
};
