/**
 * Pretty print an object for debugging.
 * Uses util.inspect in Node.js environments, falls back to JSON.stringify elsewhere.
 */
export function prettyObject(object: unknown): string {
  // Try to use Node.js util.inspect if available (runtime check, not bundled)
  if (
    typeof process !== "undefined" &&
    process.versions?.node &&
    typeof require !== "undefined"
  ) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { inspect } = require("node:util")
      return inspect(object, { colors: true, depth: null })
    } catch {
      // Fall through to JSON.stringify
    }
  }

  // Universal fallback for browsers and other environments
  return JSON.stringify(object, null, 2)
}

/**
 * Converts a field name to a relationship label
 * e.g., "userId" -> "user", "organizationId" -> "organization"
 * If field doesn't end with "id", uses the target model name
 */
export function fieldNameToLabel(
  fieldName: string,
  targetModel: string
): string {
  // Remove "Id" suffix if present
  if (fieldName.toLowerCase().endsWith("id")) {
    return fieldName.slice(0, -2)
  }
  // If it doesn't end with "id", use the target model name
  return targetModel
}
