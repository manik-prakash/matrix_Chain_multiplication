export const parseDimensions = (dimensions) => {
  try {
    const dims = dimensions.split(',').map(d => {
      const num = parseInt(d.trim());
      if (isNaN(num)) throw new Error('Invalid dimension');
      if (num <= 0) throw new Error('Dimensions must be positive');
      return num;
    });
    
    if (dims.length < 2) {
      throw new Error('Please enter at least 2 dimensions (for 1 matrix)');
    }
    
    return dims;
  } catch (err) {
    throw new Error(err.message || 'Please enter valid positive numbers separated by commas');
  }
};

export const generateMatrices = (dims) => {
  return dims.slice(0, -1).map((rows, i) => ({
    rows,
    cols: dims[i + 1]
  }));
};

export const matrixChainOrder = (dims) => {
  const n = dims.length - 1;
  const m = Array(n).fill().map(() => Array(n).fill(0));
  const s = Array(n).fill().map(() => Array(n).fill(0));

  for (let l = 2; l <= n; l++) {
    for (let i = 0; i < n - l + 1; i++) {
      const j = i + l - 1;
      m[i][j] = Infinity;
      for (let k = i; k < j; k++) {
        const q = m[i][k] + m[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1];
        if (q < m[i][j]) {
          m[i][j] = q;
          s[i][j] = k;
        }
      }
    }
  }

  return { m, s };
};

export const getOptimalParenthesization = (s, i, j) => {
  if (i === j) {
    return `A${i + 1}`;
  }
  return `(${getOptimalParenthesization(s, i, s[i][j])} × ${getOptimalParenthesization(s, s[i][j] + 1, j)})`;
}; 