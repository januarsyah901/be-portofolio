import crypto from 'crypto';

export const TOKEN_PREFIX = 'pf_';
export const MAX_ACTIVE_TOKENS = 10;

export function hashApiToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/** Creates a new random API token. Only the hash is meant to be stored. */
export function generateApiToken(): { token: string; hash: string; prefix: string } {
  const token = `${TOKEN_PREFIX}${crypto.randomBytes(32).toString('base64url')}`;
  return { token, hash: hashApiToken(token), prefix: token.slice(0, 8) };
}

export function isApiToken(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith(TOKEN_PREFIX);
}

/** Returns the credential from an `Authorization: Bearer <credential>` header. */
export function extractBearer(header: string | undefined): string | null {
  if (!header) return null;
  const [scheme, credential, ...rest] = header.trim().split(/\s+/);
  if (scheme?.toLowerCase() !== 'bearer' || !credential || rest.length > 0) return null;
  return credential;
}

export const TOKEN_SCOPES = ['read', 'write'] as const;
export type TokenScope = (typeof TOKEN_SCOPES)[number];

/** Validates a user-supplied scope. Missing/undefined defaults to "read"; anything else invalid is null. */
export function normalizeTokenScope(scope: unknown): TokenScope | null {
  if (scope === undefined) return 'read';
  return TOKEN_SCOPES.find((s) => s === scope) ?? null;
}

/** Only tokens explicitly scoped "write" may modify data. */
export function canWrite(scope: string): boolean {
  return scope === 'write';
}

/** Validates a user-supplied token name. Returns the trimmed name or null. */
export function normalizeTokenName(name: unknown): string | null {
  if (typeof name !== 'string') return null;
  const trimmed = name.trim();
  return trimmed.length >= 1 && trimmed.length <= 60 ? trimmed : null;
}
