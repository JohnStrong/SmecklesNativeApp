import { describe, it, expect, vi } from 'vitest';
import { left, right } from './Either';

describe('right', () => {
  it('creates an Either with tag right', () => {
    const e = right<string, number>(42);
    expect(e._tag).toBe('right');
  });
});

describe('left', () => {
  it('creates an Either with tag left', () => {
    const e = left<string, number>('err');
    expect(e._tag).toBe('left');
  });
});

describe('filter', () => {
  it('stays right when predicate passes', () => {
    const fn = vi.fn();
    right<string, string>('a@b.c').filter(v => v.includes('@'), 'fail').onRight(fn);
    expect(fn).toHaveBeenCalledWith('a@b.c');
  });

  it('becomes left when predicate fails', () => {
    const fn = vi.fn();
    right<string, string>('bad').filter(v => v.includes('@'), 'no @').onLeft(fn);
    expect(fn).toHaveBeenCalledWith('no @');
  });

  it('short-circuits on left without calling predicate', () => {
    const predicate = vi.fn(() => true);
    left<string, string>('already failed').filter(predicate, 'unused');
    expect(predicate).not.toHaveBeenCalled();
  });
});

describe('onLeft', () => {
  it('calls fn for left', () => {
    const fn = vi.fn();
    left<string, string>('oops').onLeft(fn);
    expect(fn).toHaveBeenCalledWith('oops');
  });

  it('does not call fn for right', () => {
    const fn = vi.fn();
    right<string, string>('ok').onLeft(fn);
    expect(fn).not.toHaveBeenCalled();
  });
});

describe('onRight', () => {
  it('calls fn for right', () => {
    const fn = vi.fn();
    right<string, string>('val').onRight(fn);
    expect(fn).toHaveBeenCalledWith('val');
  });

  it('does not call fn for left', () => {
    const fn = vi.fn();
    left<string, string>('err').onRight(fn);
    expect(fn).not.toHaveBeenCalled();
  });
});
