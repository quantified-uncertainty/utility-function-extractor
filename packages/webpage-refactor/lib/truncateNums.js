export const truncateValueForDisplay = (value) => {
  if (value > 10) {
    return Number(Math.round(value).toPrecision(2));
  } else if (value > 1) {
    return Math.round(value * 10) / 10;
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
};
