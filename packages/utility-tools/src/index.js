// IMPORTS
import * as fs from "fs";
import { mergeSort } from "./mergeSort.js";
import { findDistancesFromAllElementsToAllReferencePoints } from "./findPaths.js";
import { aggregatePaths } from "./aggregatePaths.js";

// DEFS
const inputLinksFilePath = "./input/input-links.json";
const inputListFilePath = "./input/input-list.json";
const outputFilePath = "./output/output.json";

// HELPERS

const findElementPosition = (name, orderedList) => {
  let node = orderedList.find((node) => node.name == name);
  return node.position;
};

// MAIN
async function main() {
  // read file
  const inputLinksAsString = fs.readFileSync(inputLinksFilePath);
  const inputListAsString = fs.readFileSync(inputListFilePath);
  const links = JSON.parse(inputLinksAsString);
  const list = JSON.parse(inputListAsString);

  // process file
  // const sources = links.map((link) => link.source);
  // const targets = links.map((link) => link.target);
  // const list = [...new Set([...sources, ...targets])];

  // Merge sort
  let mergeSortOutput = mergeSort({ list, links });
  // console.log("Output: ");
  console.log("Sorted output: ");
  console.group();
  console.log(mergeSortOutput.map((x) => x.name));
  console.groupEnd();
  console.log("");

  // find Paths
  let nodes = mergeSortOutput.map((element, i) => ({
    ...element,
    position: i,
  }));
  const linksWithPosition = links.map((link) => ({
    ...link,
    sourceElementPosition: findElementPosition(link.source, nodes),
    targetElementPosition: findElementPosition(link.target, nodes),
  }));
  let paths = await findDistancesFromAllElementsToAllReferencePoints({
    nodes,
    links: linksWithPosition,
  });
  // console.log(JSON.stringify(paths, null, 4));

  // Aggregate paths.
  let aggregatedPaths = aggregatePaths(paths, nodes);
}
main();
