/* ============================================================================
   LockTab — crypto.js
   All key derivation lives here and is loaded by the background context only.
   Neither the overlay nor the popup ever receives a salt, a hash, or an
   iteration count, so a compromised page has nothing to attack offline.
   ========================================================================== */

(function (global) {
  "use strict";

  const CORE = global.LockTabCore;

  /* OWASP's current PBKDF2-HMAC-SHA256 floor. WebCrypto runs this off the main
     thread, so the ~200 ms it costs stays a progress state, not a freeze. The
     value is stored next to each hash so a future increase can be rolled out
     without invalidating existing PINs. */
  const ITERATIONS = 600000;
  const SALT_BYTES = 16;
  const DERIVED_BITS = 256;

  function toBase64(bytes) {
    let binary = "";
    for (let index = 0; index < bytes.length; index += 1) {
      binary += String.fromCharCode(bytes[index]);
    }
    return btoa(binary);
  }

  function fromBase64(text) {
    try {
      const binary = atob(text);
      const bytes = new Uint8Array(binary.length);
      for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
      }
      return bytes;
    } catch (_error) {
      return null;
    }
  }

  function randomBytes(length) {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return bytes;
  }

  /** Length-independent XOR fold: no early exit that would leak a prefix match. */
  function timingSafeEqual(left, right) {
    if (typeof left !== "string" || typeof right !== "string") return false;
    const length = Math.max(left.length, right.length);
    let diff = left.length ^ right.length;
    for (let index = 0; index < length; index += 1) {
      diff |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
    }
    return diff === 0;
  }

  async function derive(pin, salt, iterations) {
    const material = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(pin),
      "PBKDF2",
      false,
      ["deriveBits"]
    );
    const bits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt,
        iterations,
        hash: "SHA-256",
      },
      material,
      DERIVED_BITS
    );
    return toBase64(new Uint8Array(bits));
  }

  /** @returns {Promise<{hash: string, salt: string, iterations: number, createdAt: number}>} */
  async function createSecret(secret) {
    const saltBytes = randomBytes(SALT_BYTES);
    const salt = toBase64(saltBytes);
    const hash = await derive(secret, saltBytes, ITERATIONS);
    /* Length is descriptive metadata, not part of the secret: it lets the UI
       stop growing the digit row at the real PIN length. */
    return { hash, salt, iterations: ITERATIONS, length: secret.length, createdAt: Date.now() };
  }

  /**
   * @param {string} secret
   * @param {{hash: string, salt: string, iterations: number} | null | undefined} record
   */
  async function verifySecret(secret, record) {
    if (!record || typeof record.hash !== "string" || typeof record.salt !== "string") return false;
    /* Storage is user-accessible; a damaged salt must read as a wrong PIN,
       not as an exception that disables verification entirely. */
    const salt = fromBase64(record.salt);
    if (!salt) return false;
    const iterations = CORE.clampIterations(record.iterations);
    const candidate = await derive(secret, salt, iterations);
    return timingSafeEqual(candidate, record.hash);
  }

  /**
   * Recovery code: 20 characters from a 32-symbol alphabet, i.e. 100 bits.
   * 32 divides 256 exactly, so the byte-to-symbol mapping is unbiased.
   */
  function createRecoveryCode() {
    const alphabet = CORE.RECOVERY_ALPHABET;
    const bytes = randomBytes(CORE.RECOVERY_LENGTH);
    let code = "";
    for (let index = 0; index < bytes.length; index += 1) {
      code += alphabet[bytes[index] % alphabet.length];
    }
    return code;
  }

  global.LockTabCrypto = {
    ITERATIONS,
    createSecret,
    verifySecret,
    createRecoveryCode,
    timingSafeEqual,
  };
})(typeof globalThis !== "undefined" ? globalThis : self);
