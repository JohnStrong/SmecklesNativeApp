import { describe, it, expect } from 'vitest';
import { withValidation, ValidationRules } from './ValidationRule';

const rules: ValidationRules = {
  rules: [
    (v) => !v ? 'Required' : null,
    (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Invalid email',
  ]
};

describe('withValidation', () => {
  it('returns right for a valid email', () => {
    const result = withValidation('test@example.com', rules);
    expect(result).toEqual({ tag: 'right', value: 'test@example.com' });
  });

  it('returns left with first failing rule error for empty string', () => {
    const result = withValidation('', rules);
    expect(result).toEqual({ tag: 'left', error: 'Required' });
  });

  it('returns left for invalid email format', () => {
    const result = withValidation('notanemail', rules);
    expect(result).toEqual({ tag: 'left', error: 'Invalid email' });
  });

  it('returns left for email missing domain', () => {
    const result = withValidation('user@', rules);
    expect(result).toEqual({ tag: 'left', error: 'Invalid email' });
  });

  it('returns right when no rules provided', () => {
    const result = withValidation('anything', { rules: [] });
    expect(result).toEqual({ tag: 'right', value: 'anything' });
  });
});
