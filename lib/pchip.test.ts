import { describe, expect, it } from 'vitest';
import { pchip } from './pchip';

describe('pchip', () => {
  it('interpolates within range without overshoot', () => {
    const fn = pchip([0, 1, 2], [0, 1, 0]);
    const mid = fn(0.5);
    expect(mid).toBeGreaterThanOrEqual(0);
    expect(mid).toBeLessThanOrEqual(1);
  });

  it('clamps outside domain', () => {
    const fn = pchip([0, 1, 2], [0, 10, 20]);
    expect(fn(-10)).toBe(0);
    expect(fn(10)).toBe(20);
  });

  it('matches knot values exactly', () => {
    const x = [0, 1, 2, 3];
    const y = [0, 5, 5, 3];
    const fn = pchip(x, y);
    x.forEach((xi, idx) => {
      expect(fn(xi)).toBeCloseTo(y[idx]);
    });
  });

  it('throws on invalid knots', () => {
    expect(() => pchip([0, 0], [1, 1])).toThrow();
  });
});
