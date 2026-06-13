import { describe, it, expect } from 'vitest';
import { Either, fold } from './Either';

describe('Either', () => {
  it('represents a left value', () => {
    const left: Either<string, number> = { tag: 'left', error: 'fail' };
    expect(left.tag).toBe('left');
    expect(left.error).toBe('fail');
  });

  it('represents a right value', () => {
    const right: Either<string, number> = { tag: 'right', value: 42 };
    expect(right.tag).toBe('right');
    expect(right.value).toBe(42);
  });
});

describe('fold', () => {
  it('transforms left via onLeft', () => {
    const result = fold<string, string, number>({ tag: 'left', error: 'x' }, () => 0, () => 1);
    expect(result).toBe(0);
  });

  it('transforms right via onRight', () => {
    const result = fold<string, string, number>({ tag: 'right', value: 'x' }, () => 0, () => 1);
    expect(result).toBe(1);
  });
});
