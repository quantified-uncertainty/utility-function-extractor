import React, { useState } from "react";

function expectedNumMergeSortSteps(n) {
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

const firstFewMaxMergeSortSequence = [
  0, 0, 1, 3, 5, 8, 11, 14, 17, 21, 25, 29, 33, 37, 41, 45, 49, 54, 59, 64, 69,
  74, 79, 84, 89, 94, 99, 104, 109, 114, 119, 124, 129, 135, 141, 147, 153, 159,
  165, 171, 177, 183, 189, 195, 201, 207, 213, 219, 225, 231, 237, 243, 249,
  255, 261, 267, 273, 279, 285,
];

function maxMergeSortSteps(n) {
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

export function ProgressIndicator({ numStepsNow, numElements }) {
  const expectedNumSteps = expectedNumMergeSortSteps(numElements);
  const maxSteps = maxMergeSortSteps(numElements);
  return (
    <p>{`${numStepsNow} out of ~${expectedNumSteps} (max ${maxSteps}) comparisons`}</p>
  );
}
