import { describe, expect, it } from 'vitest';
import { parseOrgExperienceInput } from './orgExperience';

const valid = { period: '2026', organization: 'GSA', role: 'Ambassador' };

describe('parseOrgExperienceInput (create)', () => {
  it('requires period, organization and role', () => {
    expect(parseOrgExperienceInput({}, 'create').ok).toBe(false);
    expect(parseOrgExperienceInput({ ...valid, role: undefined }, 'create').ok).toBe(false);
    expect(parseOrgExperienceInput(null, 'create').ok).toBe(false);
  });

  it('accepts a minimal body and trims text', () => {
    const r = parseOrgExperienceInput({ period: ' 2026 ', organization: ' GSA ', role: ' Ambassador ' }, 'create');
    expect(r).toEqual({ ok: true, data: { period: '2026', organization: 'GSA', role: 'Ambassador' } });
  });

  it('rejects blank required text', () => {
    expect(parseOrgExperienceInput({ ...valid, organization: '   ' }, 'create').ok).toBe(false);
  });

  it('validates optional fields', () => {
    expect(parseOrgExperienceInput({ ...valid, type: 'club' }, 'create').ok).toBe(false);
    expect(parseOrgExperienceInput({ ...valid, highlights: 'x' }, 'create').ok).toBe(false);
    expect(parseOrgExperienceInput({ ...valid, highlights: [1] }, 'create').ok).toBe(false);
    expect(parseOrgExperienceInput({ ...valid, order: 1.5 }, 'create').ok).toBe(false);
    expect(parseOrgExperienceInput({ ...valid, visible: 'yes' }, 'create').ok).toBe(false);
    expect(parseOrgExperienceInput({ ...valid, logo: 5 }, 'create').ok).toBe(false);
  });

  it('normalizes highlights and logo', () => {
    const r = parseOrgExperienceInput(
      { ...valid, type: 'event', highlights: [' a ', '', 'b'], logo: '  ', order: 2, visible: false },
      'create',
    );
    expect(r).toEqual({
      ok: true,
      data: { ...valid, type: 'event', highlights: ['a', 'b'], logo: null, order: 2, visible: false },
    });
  });

  it('ignores unknown fields', () => {
    const r = parseOrgExperienceInput({ ...valid, id: 99, hacker: true }, 'create');
    expect(r).toEqual({ ok: true, data: valid });
  });
});

describe('parseOrgExperienceInput (update)', () => {
  it('allows an empty body and partial updates', () => {
    expect(parseOrgExperienceInput({}, 'update')).toEqual({ ok: true, data: {} });
    expect(parseOrgExperienceInput({ role: 'Ketua' }, 'update')).toEqual({ ok: true, data: { role: 'Ketua' } });
  });

  it('still rejects invalid values and blank required text', () => {
    expect(parseOrgExperienceInput({ role: '' }, 'update').ok).toBe(false);
    expect(parseOrgExperienceInput({ type: 'nope' }, 'update').ok).toBe(false);
  });

  it('can clear the logo with null', () => {
    expect(parseOrgExperienceInput({ logo: null }, 'update')).toEqual({ ok: true, data: { logo: null } });
  });
});
