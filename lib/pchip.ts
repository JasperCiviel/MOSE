export function pchip(xKnots: number[], yKnots: number[]) {
  if (xKnots.length !== yKnots.length) {
    throw new Error('x and y knot arrays must be the same length');
  }
  if (xKnots.length < 2) {
    throw new Error('At least two knots are required');
  }

  const n = xKnots.length;
  for (let i = 1; i < n; i += 1) {
    if (xKnots[i] <= xKnots[i - 1]) {
      throw new Error('Knots must be strictly increasing');
    }
  }

  const h = new Array(n - 1).fill(0);
  const delta = new Array(n - 1).fill(0);
  for (let i = 0; i < n - 1; i += 1) {
    h[i] = xKnots[i + 1] - xKnots[i];
    delta[i] = (yKnots[i + 1] - yKnots[i]) / h[i];
  }

  const m = new Array(n).fill(0);

  if (n === 2) {
    m[0] = delta[0];
    m[1] = delta[0];
  } else {
    // Endpoints using one-sided three-point formula
    const h1 = h[1] ?? h[0];
    const delta1 = delta[1] ?? delta[0];
    m[0] = ((2 * h[0] + h1) * delta[0] - h[0] * delta1) / (h[0] + h1);
    if (Math.sign(m[0]) !== Math.sign(delta[0])) {
      m[0] = 0;
    } else if (Math.abs(m[0]) > 3 * Math.abs(delta[0])) {
      m[0] = 3 * delta[0];
    }

    const hnm3 = h[n - 3] ?? h[n - 2];
    const deltanm3 = delta[n - 3] ?? delta[n - 2];
    m[n - 1] = ((2 * h[n - 2] + hnm3) * delta[n - 2] - h[n - 2] * deltanm3) / (h[n - 2] + hnm3);
    if (Math.sign(m[n - 1]) !== Math.sign(delta[n - 2])) {
      m[n - 1] = 0;
    } else if (Math.abs(m[n - 1]) > 3 * Math.abs(delta[n - 2])) {
      m[n - 1] = 3 * delta[n - 2];
    }
  }

  for (let i = 1; i < n - 1; i += 1) {
    if (delta[i - 1] === 0 || delta[i] === 0 || Math.sign(delta[i - 1]) !== Math.sign(delta[i])) {
      m[i] = 0;
    } else {
      const w1 = 2 * h[i] + h[i - 1];
      const w2 = h[i] + 2 * h[i - 1];
      m[i] = (w1 + w2) / (w1 / delta[i - 1] + w2 / delta[i]);
    }
  }

  return (x: number) => {
    const clampedX = Math.min(Math.max(x, xKnots[0]), xKnots[n - 1]);
    if (clampedX === xKnots[0]) return yKnots[0];
    if (clampedX === xKnots[n - 1]) return yKnots[n - 1];

    let low = 0;
    let high = n - 1;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (xKnots[mid] <= clampedX && clampedX <= xKnots[mid + 1]) {
        low = mid;
        break;
      }
      if (xKnots[mid] < clampedX) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    const i = Math.min(low, n - 2);

    const t = (clampedX - xKnots[i]) / h[i];
    const h00 = (1 + 2 * t) * (1 - t) * (1 - t);
    const h10 = t * (1 - t) * (1 - t);
    const h01 = t * t * (3 - 2 * t);
    const h11 = t * t * (t - 1);

    const result =
      h00 * yKnots[i] +
      h10 * h[i] * m[i] +
      h01 * yKnots[i + 1] +
      h11 * h[i] * m[i + 1];

    const minVal = Math.min(yKnots[i], yKnots[i + 1]);
    const maxVal = Math.max(yKnots[i], yKnots[i + 1]);
    return Math.max(Math.min(result, maxVal), minVal);
  };
}
