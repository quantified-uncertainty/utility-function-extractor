import crypto from "crypto";

export const hashString = (string) =>
  crypto.createHash("md5").update(string).digest("hex");
const id = (x) => x;
export const transformSliderValueToActualValue = id;
export const transformSliderValueToPracticalValue = id;

export const _transformSliderValueToActualValue = (value) => 10 ** value; //>= 2 ? Math.round(10 ** value) : Math.round(10 * 10 ** value) / 10
export const toLocale = (x) => Number(x).toLocaleString();
export const truncateValueForDisplay = (value) => {
  if (value > 10) {
    return Number(Math.round(value).toPrecision(2));
  } else if (value > 1) {
    return Math.round(value * 10) / 10;
  } else if (value <= 1) {
    return value;
  }
};
export const _transformSliderValueToPracticalValue = (value) =>
  truncateValueForDisplay(transformSliderValueToActualValue(value));

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function numToAlphabeticalString(num) {
  // https://stackoverflow.com/questions/45787459/convert-number-to-alphabet-string-javascript/45787487
  num = num + 1;
  var s = "",
    t;
  while (num > 0) {
    t = (num - 1) % 26;
    s = String.fromCharCode(65 + t) + s;
    num = ((num - t) / 26) | 0;
  }
  return `#${s}` || undefined;
}

let topOutAt100AndValidate = (x) => {
  // return 10;
  if (x == x) {
    return x > 99 ? 99 : x < 0 ? 2 : x;
  } else {
    return 10;
  }
};

export function formatLargeOrSmall(num) {
  let result;
  if (num >= 1) {
    result = toLocale(truncateValueForDisplay(num));
  } else if (num > 0) {
    let candidateNumSignificantDigits =
      -Math.floor(Math.log(num) / Math.log(10)) + 1;
    let numSignificantDigits = topOutAt100AndValidate(
      candidateNumSignificantDigits
    );
    result = num.toFixed(numSignificantDigits);
  } else if (-1 < num) {
    let candidateNumSignificantDigits =
      -Math.floor(Math.log(Math.abs(num)) / Math.log(10)) + 1;
    let numSignificantDigits = topOutAt100AndValidate(
      candidateNumSignificantDigits
    );
    result = num.toFixed(numSignificantDigits);
  } else if (num <= -1) {
    result = "-" + toLocale(truncateValueForDisplay(-num));
  } else {
    result = toLocale(num); //return "~0"
  }

  console.log(`${num} -> ${result}`);
  return result;
}
const firstFewMaxMergeSortSequence = [
  0, 0, 1, 3, 5, 8, 11, 14, 17, 21, 25, 29, 33, 37, 41, 45, 49, 54, 59, 64, 69,
  74, 79, 84, 89, 94, 99, 104, 109, 114, 119, 124, 129, 135, 141, 147, 153, 159,
  165, 171, 177, 183, 189, 195, 201, 207, 213, 219, 225, 231, 237, 243, 249,
  255, 261, 267, 273, 279, 285,
];

export function maxMergeSortSteps(n) {
  if (n < firstFewMaxMergeSortSequence.length) {
    return firstFewMaxMergeSortSequence[n];
  } else {
    return (
      maxMergeSortSteps(Math.floor(n / 2)) +
      maxMergeSortSteps(Math.ceil(n / 2)) +
      n -
      1
    );
  }
}

export function expectedNumMergeSortSteps(n) {
  // https://cs.stackexchange.com/questions/82862/expected-number-of-comparisons-in-a-merge-step
  // n-2 for each step, so (n-2) + (n-2)/2 + (n-2)/4 + ...
  // ~ 2*(n-2) -1 = 2*n - 3
  if (n == 0) {
    return 0;
  } else if (n == 1) {
    return 0;
  } else if (n == 2) {
    return 1;
  } else if (n == 3) {
    return 2;
  } else {
    return (
      Math.ceil(n ** 2 / (n + 2)) + expectedNumMergeSortSteps(Math.ceil(n / 2))
    );
  }
}

const sum = (arr) => arr.reduce((a, b) => a + b, 0);

export const avg = (arr) => sum(arr) / arr.length;

export const geomMean = (arr) => {
  let n = arr.length;
  let logavg = sum(arr.map((x) => Math.log(x))); // works for low numbers much better
  let result = Math.exp(logavg / n);
  return result;
};

export const hackyGeomMean = (arr) => {
  let nonPositiveNumbers = arr.filter((x) => x <= 0);
  if (nonPositiveNumbers.length == 0) {
    return geomMean(arr);
  } else {
    return avg(arr);
  }
};

export function conservativeNumMergeSortSteps(n) {
  return Math.ceil((expectedNumMergeSortSteps(n) + maxMergeSortSteps(n)) / 2);
}
// export const geomMean = (arr) => arr.reduce((a, b) => a * b, 1); // ^ (1 / arr.length); // didn't work so well for low numbers.

export const increasingList = (n) => Array.from(Array(n).keys());

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
