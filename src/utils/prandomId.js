/**
 * Creates a random string of 0-9a-z that is unique enough for most needs.
 * This is NOT cryptographically random!  Just a hack for quick unique ids.
 * They may not even be the same length because of Math.random!
 * @return {string} Random string.
 */
export default function prandomId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
