/**
 * Editable website sections stored as JSON in the SiteContent table.
 * Every key has a strict validator: the frontend renders these values directly, so a bad
 * shape (or a `javascript:` link) must be rejected at write time. Unknown fields are dropped.
 */
export const SITE_CONTENT_KEYS = ['experience', 'skills', 'about', 'contact'] as const;
export type SiteContentKey = (typeof SITE_CONTENT_KEYS)[number];

export type ValidationResult = { ok: true; value: unknown } | { ok: false; message: string };

export function isSiteContentKey(key: string): key is SiteContentKey {
  return (SITE_CONTENT_KEYS as readonly string[]).includes(key);
}

class Invalid extends Error {}

type Obj = Record<string, unknown>;

function obj(value: unknown, path: string): Obj {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Invalid(`"${path}" harus berupa objek.`);
  return value as Obj;
}

function text(value: unknown, path: string, max: number, { optional = false } = {}): string {
  if (value === undefined && optional) return '';
  if (typeof value !== 'string') throw new Invalid(`"${path}" harus berupa teks.`);
  const trimmed = value.trim();
  if (!optional && trimmed === '') throw new Invalid(`"${path}" tidak boleh kosong.`);
  if (trimmed.length > max) throw new Invalid(`"${path}" maksimal ${max} karakter.`);
  return trimmed;
}

function list<T>(value: unknown, path: string, max: number, min: number, each: (item: unknown, itemPath: string) => T): T[] {
  if (!Array.isArray(value)) throw new Invalid(`"${path}" harus berupa daftar.`);
  if (value.length < min) throw new Invalid(`"${path}" minimal ${min} item.`);
  if (value.length > max) throw new Invalid(`"${path}" maksimal ${max} item.`);
  return value.map((item, i) => each(item, `${path}[${i}]`));
}

function bool(value: unknown, path: string): boolean {
  if (value === undefined) return false;
  if (typeof value !== 'boolean') throw new Invalid(`"${path}" harus true atau false.`);
  return value;
}

function httpsUrl(value: unknown, path: string): string {
  const url = text(value, path, 300);
  if (!/^https:\/\/[^\s]+$/i.test(url)) throw new Invalid(`"${path}" harus berupa URL https://.`);
  return url;
}

function email(value: unknown, path: string): string {
  const v = text(value, path, 120);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) throw new Invalid(`"${path}" bukan alamat email yang valid.`);
  return v;
}

const validators: Record<SiteContentKey, (raw: unknown) => unknown> = {
  experience: (raw) => {
    const o = obj(raw, 'experience');
    return {
      eyebrow: text(o.eyebrow, 'eyebrow', 100),
      title: text(o.title, 'title', 200),
      items: list(o.items, 'items', 20, 0, (item, p) => {
        const i = obj(item, p);
        return {
          period: text(i.period, `${p}.period`, 60),
          badge: text(i.badge, `${p}.badge`, 80),
          accent: bool(i.accent, `${p}.accent`),
          title: text(i.title, `${p}.title`, 200),
          role: text(i.role, `${p}.role`, 120),
          description: text(i.description, `${p}.description`, 2000),
        };
      }),
    };
  },

  skills: (raw) => {
    const o = obj(raw, 'skills');
    return {
      eyebrow: text(o.eyebrow, 'eyebrow', 100),
      title: text(o.title, 'title', 200),
      categories: list(o.categories, 'categories', 12, 0, (cat, p) => {
        const c = obj(cat, p);
        return {
          label: text(c.label, `${p}.label`, 60),
          title: text(c.title, `${p}.title`, 120),
          description: text(c.description, `${p}.description`, 500),
          skills: list(c.skills, `${p}.skills`, 12, 0, (skill, sp) => {
            const s = obj(skill, sp);
            const level = s.level;
            if (typeof level !== 'number' || !Number.isInteger(level) || level < 0 || level > 100) {
              throw new Invalid(`"${sp}.level" harus bilangan bulat 0-100.`);
            }
            return { name: text(s.name, `${sp}.name`, 80), level };
          }),
        };
      }),
    };
  },

  about: (raw) => {
    const o = obj(raw, 'about');
    return {
      eyebrow: text(o.eyebrow, 'eyebrow', 100),
      name: text(o.name, 'name', 120),
      paragraphs: list(o.paragraphs, 'paragraphs', 10, 1, (p, path) => text(p, path, 2000)),
      summaryTitle: text(o.summaryTitle, 'summaryTitle', 100),
      summary: list(o.summary, 'summary', 12, 0, (row, p) => {
        const r = obj(row, p);
        return {
          label: text(r.label, `${p}.label`, 80),
          value: text(r.value, `${p}.value`, 200),
          accent: bool(r.accent, `${p}.accent`),
        };
      }),
    };
  },

  contact: (raw) => {
    const o = obj(raw, 'contact');
    return {
      ctaTitle: text(o.ctaTitle, 'ctaTitle', 120),
      ctaSubtitle: text(o.ctaSubtitle, 'ctaSubtitle', 300),
      brandDesc: text(o.brandDesc, 'brandDesc', 500),
      email: email(o.email, 'email'),
      location: text(o.location, 'location', 120),
      github: httpsUrl(o.github, 'github'),
      linkedin: httpsUrl(o.linkedin, 'linkedin'),
      x: httpsUrl(o.x, 'x'),
      instagram: httpsUrl(o.instagram, 'instagram'),
    };
  },
};

/** Validates and normalizes the value for a key. The whole value is replaced on write (no merging). */
export function validateSiteContent(key: SiteContentKey, raw: unknown): ValidationResult {
  try {
    return { ok: true, value: validators[key](raw) };
  } catch (error) {
    if (error instanceof Invalid) return { ok: false, message: error.message };
    throw error;
  }
}
