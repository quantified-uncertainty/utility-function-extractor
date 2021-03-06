// IMPORTS
import * as fs from "fs";
import { mergeSort } from "./mergeSort.js";
import { findDistances } from "./findPaths.js";
import { aggregatePaths } from "./aggregatePaths.js";

// DEFS
const inputLinksFilePath = "./input/input-links.json";
const inputListFilePath = "./input/input-list.json";
const outputFilePath = "./output/output.json";

// HELPERS

// MAIN
async function main() {
  // Read file
  const inputLinksAsString = fs.readFileSync(inputLinksFilePath);
  const inputListAsString = fs.readFileSync(inputListFilePath);
  const links = JSON.parse(inputLinksAsString);
  const list = JSON.parse(inputListAsString);

  // Merge sort
  let mergeSortOutput = mergeSort({ list, links });
  if (mergeSortOutput.finishedOrderingList == false) {
    console.log("Merge could not proceed");
    console.group();
    console.log("Elements which need to be compared:");
    console.log(mergeSortOutput.uncomparedElements);
    console.groupEnd();
  } else {
    let orderedList = mergeSortOutput.orderedList;
    console.log("Sorted output: ");
    console.group();
    console.log(orderedList.map((x) => x.name));
    console.groupEnd();
    console.log("");

    // find Paths
    let paths = await findDistances({ orderedList, links });

    // Aggregate paths.
    let aggregatedPaths = await aggregatePaths({
      pathsArray: paths,
      orderedList,
      aggregationType: "mean", // alternatively: aggregationType: "distribution"
      VERBOSE: false, // optional arg
      DONT_EXCLUDE_INFINITIES_AND_NANS: false, // optional arg
    });
    console.log(aggregatedPaths);
  }
}
main();
