let topOutAt100AndValidate = (x) => {
  if (x == x) {
    return x > 99 ? 99 : x < 0 ? 2 : x;
  } else {
    return 10;
  }
};

export const toLocale = (x) => Number(x).toLocaleString();

export const truncateValueForDisplay = (value) => {
  let result;
  if (value > 10) {
    result = Number(Math.round(value).toPrecision(2));
  } else if (value > 1) {
    result = Math.round(value * 10) / 10;
  } else if (value > 0) {
    let candidateNumSignificantDigits =
      -Math.floor(Math.log(value) / Math.log(10)) + 1;
    let numSignificantDigits = topOutAt100AndValidate(
      candidateNumSignificantDigits
    );
    result = value.toFixed(numSignificantDigits);
  } else if (value == 0) {
    return 0;
  } else if (-1 < value) {
    let candidateNumSignificantDigits =
      -Math.floor(Math.log(Math.abs(value)) / Math.log(10)) + 1;
    let numSignificantDigits = topOutAt100AndValidate(
      candidateNumSignificantDigits
    );
    result = value.toFixed(numSignificantDigits);
  } else if (value <= -1) {
    result = "-" + toLocale(truncateValueForDisplay(-value));
  } else {
    result = toLocale(value); //return "~0"
  }
  return result;
};
