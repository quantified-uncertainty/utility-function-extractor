export const cutOffLongNames = (string) => {
  let maxLength = 40;
  let result;
  if (string.length < maxLength) {
    result = string;
  } else {
    result = string.slice(0, maxLength - 4);
    result = result + "...";
  }
  return result;
};
