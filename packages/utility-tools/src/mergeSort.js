const errorMsg = "No link found; unable to proceed";

function isFirstElementGreater(links, element1, element2) {
  const relevantComparisons = links.filter(
    (link) =>
      (link.source == element1.name && link.target == element2.name) ||
      (link.source == element2.name && link.target == element1.name)
  );
  if (relevantComparisons.length == 0) {
    // console.log(element1, "vs", element2);
    let answer = {
      foundAnswer: false,
      error: errorMsg,
    };
    return answer;
  } else {
    const firstLink = relevantComparisons[0];
    // console.log(firstLink);
    const firstElementFirst =
      firstLink.source == element1.name && firstLink.target == element2.name
        ? true
        : false;
    const distanceIsGreaterThanOne = Number(firstLink.distance) > 1;
    const isFirstElementFirst =
      (firstElementFirst && !distanceIsGreaterThanOne) ||
      (!firstElementFirst && distanceIsGreaterThanOne);
    let answer = {
      foundAnswer: true,
      isFirstElementFirst,
      errorMsg,
    };
    return answer;
  }
}

function merge(links, left, right) {
  let sortedArr = []; // the sorted elements will go here

  while (left.length && right.length) {
    // insert the biggest element to the sortedArr
    let getComparisonAnswer = isFirstElementGreater(links, left[0], right[0]);
    if (getComparisonAnswer.foundAnswer == false) {
      // console.log("Error@:");
      // console.group();
      // console.log({ left, right });
      // console.groupEnd();
      let result = {
        finishedMerge: false,
        uncomparedElements: [left[0], right[0]],
        errorMsg: errorMsg,
      };
      return result;
    } else if (getComparisonAnswer.foundAnswer == true) {
      if (getComparisonAnswer.isFirstElementFirst == true) {
        // left[0] > right[0]
        sortedArr.push(right.shift());
      } else {
        sortedArr.push(left.shift());
      }
    }
  }

  // use spread operator and create a new array, combining the three arrays
  let result = {
    finishedMerge: true,
    orderedList: [...sortedArr, ...left, ...right],
    // if they don't have the same size, the remaining ones will be greater than the ones before
  };
  return result;
}

export function mergeSortInner({ recursiveInput, links }) {
  // console.log({ l: list.length });
  if (recursiveInput.bottleneckedByComparison == true) {
    let result = {
      recursiveInput: {
        list: recursiveInput.list,
        bottleneckedByComparison: true,
        uncomparedElements: recursiveInput.uncomparedElements,
      },
      links: links,
    };
    return result;
  }
  const half = recursiveInput.list.length / 2;

  // the base case is list length <=1
  if (recursiveInput.list.length <= 1) {
    let result = {
      recursiveInput: {
        bottleneckedByComparison: false,
        list: recursiveInput.list,
      },
      links: links,
    };
    return result;
  }

  const left = recursiveInput.list.slice(0, half); // the first half of the list
  const right = recursiveInput.list.slice(half, recursiveInput.list.length); // Note that splice is destructive.
  let orderedFirstHalfAnswer = mergeSortInner({
    recursiveInput: { list: left, bottleneckedByComparison: false },
    links,
  });
  let orderedSecondHalfAnswer = mergeSortInner({
    recursiveInput: { list: right, bottleneckedByComparison: false },
    links,
  });
  if (
    orderedFirstHalfAnswer.recursiveInput.bottleneckedByComparison == false &&
    orderedSecondHalfAnswer.recursiveInput.bottleneckedByComparison == false
  ) {
    let mergeStepAnswer = merge(
      links,
      orderedFirstHalfAnswer.recursiveInput.list,
      orderedSecondHalfAnswer.recursiveInput.list
    );
    if (mergeStepAnswer.finishedMerge == true) {
      let result = {
        recursiveInput: {
          list: mergeStepAnswer.orderedList,
          bottleneckedByComparison: false,
        },
        links,
      };
      return result;
    } else {
      let result = {
        recursiveInput: {
          list: recursiveInput.list,
          bottleneckedByComparison: true,
          uncomparedElements: mergeStepAnswer.uncomparedElements,
        },
        links,
      };
      return result;
    }
  } else if (
    orderedFirstHalfAnswer.recursiveInput.bottleneckedByComparison == true
  ) {
    return orderedFirstHalfAnswer;
  } else {
    return orderedSecondHalfAnswer;
  }
}

export function mergeSort({ list, links }) {
  // Try normally
  let answer = mergeSortInner({
    recursiveInput: { list, bottleneckedByComparison: false },
    links,
  });
  if (answer.recursiveInput.bottleneckedByComparison == false) {
    let result = {
      finishedOrderingList: true,
      orderedList: answer.recursiveInput.list,
    };
    return result;
  } else {
    let result = {
      finishedOrderingList: false,
      uncomparedElements: answer.recursiveInput.uncomparedElements,
    };
    return result;
  }
  /*
  // otherwise
  let permutation = list.slice();
  var length = list.length;
  // let result = [list.slice()];
  let c = new Array(length).fill(0);
  let i = 1;
  let k;
  let p;
  let counter = 0;

  while (i < length) {
    counter++;
    if (counter > 10) console.log(counter);
    if (c[i] < i) {
      k = i % 2 && c[i];
      p = permutation[i];
      permutation[i] = permutation[k];
      permutation[k] = p;
      // ++c[i];
      c[i] = c[i] + 1;
      i = 1;
      let answer = mergeSortInner({ list: permutation, links });
      if (answer != errorMsg) {
        console.log(answer);
        return answer;
      }
      // result.push(permutation.slice());
    } else {
      c[i] = 0;
      i = i + 1;
      // ++i;
    }
  }
  console.log("Error");
  return "Error: The original list was wrongly ordered, and trying permutations didn't work";
  */
}
