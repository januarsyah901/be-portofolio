import { describe, expect, it } from 'vitest';
import { SITE_CONTENT_KEYS, isSiteContentKey, validateSiteContent } from './siteContent';
import { SITE_CONTENT_DEFAULTS } from './siteContentDefaults';

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));

describe('built-in defaults', () => {
  it.each(SITE_CONTENT_KEYS)('"%s" passes its own validator unchanged', (key) => {
    const result = validateSiteContent(key, clone(SITE_CONTENT_DEFAULTS[key]));
    expect(result).toEqual({ ok: true, value: SITE_CONTENT_DEFAULTS[key] });
  });
});

describe('isSiteContentKey', () => {
  it('accepts only known keys', () => {
    expect(isSiteContentKey('skills')).toBe(true);
    expect(isSiteContentKey('hero')).toBe(false);
    expect(isSiteContentKey('__proto__')).toBe(false);
  });
});

describe('validateSiteContent', () => {
  it('rejects non-objects and missing fields', () => {
    expect(validateSiteContent('experience', null).ok).toBe(false);
    expect(validateSiteContent('experience', []).ok).toBe(false);
    expect(validateSiteContent('experience', { eyebrow: 'x' }).ok).toBe(false);
  });

  it('drops unknown fields and trims text', () => {
    const input = clone(SITE_CONTENT_DEFAULTS.experience) as any;
    input.evil = 1;
    input.items[0].extra = 'x';
    input.title = '  Judul  ';
    const result = validateSiteContent('experience', input) as any;
    expect(result.ok).toBe(true);
    expect(result.value.evil).toBeUndefined();
    expect(result.value.items[0].extra).toBeUndefined();
    expect(result.value.title).toBe('Judul');
  });

  it('defaults accent to false and rejects non-boolean accent', () => {
    const input = clone(SITE_CONTENT_DEFAULTS.experience) as any;
    delete input.items[0].accent;
    expect((validateSiteContent('experience', input) as any).value.items[0].accent).toBe(false);
    input.items[0].accent = 'yes';
    expect(validateSiteContent('experience', input).ok).toBe(false);
  });

  it('requires skill levels to be integers from 0 to 100', () => {
    for (const level of [101, -1, 50.5, '80', null]) {
      const input = clone(SITE_CONTENT_DEFAULTS.skills) as any;
      input.categories[0].skills[0].level = level;
      expect(validateSiteContent('skills', input).ok).toBe(false);
    }
  });

  it('requires at least one about paragraph', () => {
    const input = clone(SITE_CONTENT_DEFAULTS.about) as any;
    input.paragraphs = [];
    expect(validateSiteContent('about', input).ok).toBe(false);
  });

  it('only allows https links and valid emails in contact', () => {
    const base = clone(SITE_CONTENT_DEFAULTS.contact) as any;
    for (const bad of ['javascript:alert(1)', 'http://x.com', '//x.com', 'https://a b.com', 'data:text/html,x']) {
      expect(validateSiteContent('contact', { ...base, github: bad }).ok).toBe(false);
    }
    expect(validateSiteContent('contact', { ...base, email: 'not-an-email' }).ok).toBe(false);
    expect(validateSiteContent('contact', { ...base, github: 'https://github.com/x' }).ok).toBe(true);
  });

  it('enforces list and text size limits', () => {
    const input = clone(SITE_CONTENT_DEFAULTS.experience) as any;
    input.items = Array.from({ length: 21 }, () => input.items[0]);
    expect(validateSiteContent('experience', input).ok).toBe(false);
    const long = clone(SITE_CONTENT_DEFAULTS.about) as any;
    long.paragraphs = ['x'.repeat(2001)];
    expect(validateSiteContent('about', long).ok).toBe(false);
  });
});
