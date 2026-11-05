import { describe, expect, it } from 'vitest';
import {
  extractBearer,
  generateApiToken,
  hashApiToken,
  isApiToken,
  normalizeTokenName,
} from './apiToken';

describe('generateApiToken', () => {
  it('creates prefixed, unique tokens whose hash matches', () => {
    const a = generateApiToken();
    const b = generateApiToken();
    expect(a.token.startsWith('pf_')).toBe(true);
    expect(a.token).not.toBe(b.token);
    expect(a.prefix).toBe(a.token.slice(0, 8));
    expect(a.hash).toBe(hashApiToken(a.token));
    expect(a.hash).toMatch(/^[0-9a-f]{64}$/);
    expect(a.hash).not.toContain(a.token);
  });
});

describe('isApiToken', () => {
  it('distinguishes API tokens from JWTs and junk', () => {
    expect(isApiToken('pf_abc')).toBe(true);
    expect(isApiToken('eyJhbGciOiJIUzI1NiJ9.x.y')).toBe(false);
    expect(isApiToken(undefined)).toBe(false);
  });
});

describe('extractBearer', () => {
  it('parses a well-formed header', () => {
    expect(extractBearer('Bearer abc')).toBe('abc');
    expect(extractBearer('bearer abc')).toBe('abc');
  });

  it('rejects malformed headers', () => {
    expect(extractBearer(undefined)).toBeNull();
    expect(extractBearer('')).toBeNull();
    expect(extractBearer('Basic abc')).toBeNull();
    expect(extractBearer('Bearer')).toBeNull();
    expect(extractBearer('Bearer a b')).toBeNull();
  });
});

describe('normalizeTokenName', () => {
  it('trims and enforces 1-60 characters', () => {
    expect(normalizeTokenName('  Claude Code ')).toBe('Claude Code');
    expect(normalizeTokenName('   ')).toBeNull();
    expect(normalizeTokenName('x'.repeat(61))).toBeNull();
    expect(normalizeTokenName(42)).toBeNull();
  });
});
