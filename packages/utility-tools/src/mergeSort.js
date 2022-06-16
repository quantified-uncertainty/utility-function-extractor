const errorMsg = "No link found; unable to proceed";

function isFirstElementGreater(links, element1, element2) {
  const relevantComparisons = links.filter(
    (link) =>
      (link.source == element1.name && link.target == element2.name) ||
      (link.source == element2.name && link.target == element1.name)
  );
  if (relevantComparisons.length == 0) {
    // console.log(element1, "vs", element2);
    return errorMsg;
  } else {
    const firstLink = relevantComparisons[0];
    // console.log(firstLink);
    const firstElementFirst =
      firstLink.source == element1.name && firstLink.target == element2.name
        ? true
        : false;
    const distanceIsGreaterThanOne = Number(firstLink.distance) > 1;
    const answer =
      (firstElementFirst && !distanceIsGreaterThanOne) ||
      (!firstElementFirst && distanceIsGreaterThanOne);
    return !answer;
  }
}

function merge(links, left, right) {
  let sortedArr = []; // the sorted elements will go here

  while (left.length && right.length) {
    // insert the biggest element to the sortedArr
    let link = isFirstElementGreater(links, left[0], right[0]);
    if (link == errorMsg) {
      // console.log("Error@:");
      // console.group();
      // console.log({ left, right });
      // console.groupEnd();
      return errorMsg;
    } else if (link) {
      // left[0] > right[0]
      sortedArr.push(left.shift());
    } else {
      sortedArr.push(right.shift());
    }
  }

  // use spread operator and create a new array, combining the three arrays
  return [...sortedArr, ...left, ...right]; // if they don't have the same size, the remaining ones will be greater than the ones before
}

export function mergeSortInner({ list, links }) {
  // console.log({ l: list.length });
  if (list == errorMsg) {
    return errorMsg;
  }
  const half = list.length / 2;

  // the base case is list length <=1
  if (list.length <= 1) {
    return list;
  }

  const left = list.slice(0, half); // the first half of the list
  const right = list.slice(half, list.length); // Note that splice is destructive.
  let orderedFirstHalf = mergeSortInner({ list: left, links });
  let orderedSecondHalf = mergeSortInner({ list: right, links });
  if (orderedFirstHalf != errorMsg && orderedSecondHalf != errorMsg) {
    let result = merge(links, orderedFirstHalf, orderedSecondHalf);
    return result;
  } else {
    return errorMsg;
  }
}

export function mergeSort({ list, links }) {
  // Try normally
  let answer = mergeSortInner({ list, links });
  if (answer != errorMsg) return answer;

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
}
