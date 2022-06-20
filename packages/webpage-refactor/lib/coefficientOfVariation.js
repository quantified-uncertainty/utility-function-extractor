const sum = (arr) => arr.reduce((a, b) => a + b, 0);

function getStdev(arr) {
  if (Array.isArray(arr) && arr.length > 0) {
    const n = arr.length;
    const mean = arr.reduce((a, b) => a + b) / n;
    return Math.sqrt(
      arr.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n
    );
  } else {
    return 0;
  }
}

export const avg = (arr) => sum(arr) / arr.length;

export const geomMean = (arr) => {
  let n = arr.length;
  let logavg = sum(arr.map((x) => Math.log(x))); // works for low numbers much better, numerically
  let result = Math.exp(logavg / n);
  return result;
};

export const getCoefficientOfVariation = (arr) => {
  let nonPositiveNumbers = arr.filter((x) => x <= 0);
  if (nonPositiveNumbers.length == 0) {
    let gm = geomMean(arr);
    let stdev = getStdev(arr);
    return stdev / gm;
  } else {
    return getStdev(arr) / avg(arr);
  }
};
