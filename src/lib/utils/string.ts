/**
 * Capitalizes the first character of a string, leaving the rest untouched.
 * e.g. "mette" -> "Mette"
 */
export function capitalize(value: string): string {
    if (value.length === 0) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
}
