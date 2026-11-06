export const ORG_TYPES = ['organization', 'event'] as const;
export type OrgType = (typeof ORG_TYPES)[number];

export interface OrgExperienceData {
  period: string;
  organization: string;
  role: string;
  description: string;
  highlights: string[];
  type: OrgType;
  logo: string | null;
  order: number;
  visible: boolean;
}

export type ParseResult =
  | { ok: true; data: Partial<OrgExperienceData> }
  | { ok: false; message: string };

const REQUIRED_TEXT = ['period', 'organization', 'role'] as const;

const fail = (message: string): ParseResult => ({ ok: false, message });

/**
 * Validates a create/update body for an org experience entry.
 * - create: period, organization and role are required; other fields fall back to DB defaults.
 * - update: any subset of fields; only the given (valid) fields are returned.
 * Unknown fields are ignored. Strings are trimmed.
 */
export function parseOrgExperienceInput(body: unknown, mode: 'create' | 'update'): ParseResult {
  const input = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
  const data: Partial<OrgExperienceData> = {};

  for (const key of REQUIRED_TEXT) {
    const value = input[key];
    if (value === undefined) {
      if (mode === 'create') return fail('Periode, nama organisasi/event, dan peran wajib diisi.');
      continue;
    }
    if (typeof value !== 'string' || value.trim() === '') {
      return fail(`Field "${key}" harus berupa teks yang tidak kosong.`);
    }
    data[key] = value.trim();
  }

  if (input.description !== undefined) {
    if (typeof input.description !== 'string') return fail('Field "description" harus berupa teks.');
    data.description = input.description.trim();
  }

  if (input.highlights !== undefined) {
    if (!Array.isArray(input.highlights) || input.highlights.some((h) => typeof h !== 'string')) {
      return fail('Field "highlights" harus berupa daftar teks.');
    }
    data.highlights = (input.highlights as string[]).map((h) => h.trim()).filter(Boolean);
  }

  if (input.type !== undefined) {
    if (!ORG_TYPES.includes(input.type as OrgType)) {
      return fail(`Field "type" harus salah satu dari: ${ORG_TYPES.join(', ')}.`);
    }
    data.type = input.type as OrgType;
  }

  if (input.logo !== undefined) {
    if (input.logo !== null && typeof input.logo !== 'string') {
      return fail('Field "logo" harus berupa teks atau null.');
    }
    data.logo = input.logo === null || input.logo.trim() === '' ? null : input.logo.trim();
  }

  if (input.order !== undefined) {
    if (!Number.isInteger(input.order)) return fail('Field "order" harus berupa bilangan bulat.');
    data.order = input.order as number;
  }

  if (input.visible !== undefined) {
    if (typeof input.visible !== 'boolean') return fail('Field "visible" harus true atau false.');
    data.visible = input.visible;
  }

  return { ok: true, data };
}
