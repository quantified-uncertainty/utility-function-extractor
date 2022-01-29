/* Imports*/
import React from "react";
import {
  numToAlphabeticalString,
  formatLargeOrSmall,
  avg,
  geomMean,
} from "../lib/utils.js";

/* Functions */

const pathPlusLink = (pathSoFar, link) => {
  return [...pathSoFar, link];
  // previously: pathSoFar.concat(link).flat()
  // Note that concat is not destructive
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat
};

async function findPathsWithoutPrunning({
  sourceElementId,
  targetElementId,
  maxLengthOfPath,
  pathSoFar,
  links,
  nodes,
}) {
  // This is an un-used function which might make findPaths more understandable
  // It uses the same recursive functionality
  // but has no path prunning
  let paths = [];

  /* Path traversing */
  if (maxLengthOfPath > 0) {
    for (let link of links) {
      // vs let link of linksNow in findPaths
      if (
        (link.source == sourceElementId && link.target == targetElementId) ||
        (link.source == targetElementId && link.target == sourceElementId)
      ) {
        // direct Path
        let newPath = pathPlusLink(pathSoFar, link);
        paths.push(newPath);
      } else if (link.source == sourceElementId) {
        let newPaths = await findPaths({
          pathSoFar: pathPlusLink(pathSoFar, link),
          maxLengthOfPath: maxLengthOfPath - 1,
          sourceElementId: link.target,
          targetElementId,
          links: links, // vs let link of linksInner in findPaths
          nodes,
        });
        if (newPaths.length != 0) {
          paths.push(...newPaths);
        }
      } else if (link.target == sourceElementId) {
        let newPaths = await findPaths({
          pathSoFar: pathPlusLink(pathSoFar, link),
          maxLengthOfPath: maxLengthOfPath - 1,
          sourceElementId: link.source,
          targetElementId,
          links: links, // vs let link of linksInner in findPaths
          nodes,
        });
        if (newPaths.length != 0) {
          paths.push(...newPaths);
        }
      }
    }
  }

  return paths;
}

async function findPaths({
  sourceElementId,
  sourceElementPosition,
  targetElementId,
  targetElementPosition,
  maxLengthOfPath,
  pathSoFar,
  links,
  nodes,
}) {
  // This is the key path finding function
  // It finds the path from one element to another, recursively
  // It used to be very computationally expensive until I added
  // the path prunning step: Instead of traversing all links,
  // traverse only those which are between the origin and target links
  // this requires us to have a notion of "between"

  let paths = [];

  /* Path prunning*/
  let minPos = Math.min(sourceElementPosition, targetElementPosition);
  let maxPos = Math.max(sourceElementPosition, targetElementPosition);
  let linksInner = links.filter(
    (link) =>
      minPos <= link.sourceElementPosition &&
      link.sourceElementPosition <= maxPos &&
      minPos <= link.targetElementPosition &&
      link.targetElementPosition <= maxPos
  );
  let linksNow = linksInner.filter(
    (link) => link.source == sourceElementId || link.target == sourceElementId
  );

  /* Path traversing */
  if (maxLengthOfPath > 0) {
    for (let link of linksNow) {
      if (
        (link.source == sourceElementId && link.target == targetElementId) ||
        (link.source == targetElementId && link.target == sourceElementId)
      ) {
        // direct Path
        let newPath = pathPlusLink(pathSoFar, link);
        paths.push(newPath);
      } else if (link.source == sourceElementId) {
        let newPaths = await findPaths({
          pathSoFar: pathPlusLink(pathSoFar, link),
          maxLengthOfPath: maxLengthOfPath - 1,
          sourceElementPosition: link.sourceElementPosition,
          sourceElementId: link.target,
          targetElementId,
          targetElementPosition,
          links: linksInner,
          nodes,
        });
        if (newPaths.length != 0) {
          paths.push(...newPaths);
        }
      } else if (link.target == sourceElementId) {
        let newPaths = await findPaths({
          pathSoFar: pathPlusLink(pathSoFar, link),
          maxLengthOfPath: maxLengthOfPath - 1,
          sourceElementPosition: link.sourceElementPosition,
          sourceElementId: link.source,
          targetElementPosition,
          targetElementId,
          links: linksInner,
          nodes,
        });
        if (newPaths.length != 0) {
          paths.push(...newPaths);
        }
      }
    }
  }

  return paths;
}

async function findDistance({
  sourceElementId,
  sourceElementPosition,
  targetElementId,
  targetElementPosition,
  nodes,
  links,
}) {
  // This function gets all possible paths using findPaths
  // then orders them correctly in the for loop
  // (by flipping the distance to 1/distance when necessary)
  // and then gets the array of weights for the different paths.
  console.log(
    `findDistance@findPaths.js from ${sourceElementPosition} to ${targetElementPosition}`
  );

  let maxLengthOfPath = Math.abs(sourceElementPosition - targetElementPosition);
  let paths = await findPaths({
    sourceElementId,
    sourceElementPosition,
    targetElementId,
    targetElementPosition,
    links,
    nodes,
    maxLengthOfPath,
    pathSoFar: [],
  });

  let weights = [];
  for (let path of paths) {
    let currentSource = sourceElementId;
    let weight = 1;
    for (let element of path) {
      let distance = 0;
      if (element.source == currentSource) {
        distance = element.distance;
        currentSource = element.target;
      } else if (element.target == currentSource) {
        distance = 1 / Number(element.distance);
        currentSource = element.source;
      }
      weight = weight * distance;
    }
    weights.push(weight);
  }
  return weights;
}

async function findDistancesForAllElements({ nodes, links }) {
  // Simple wrapper function around findDistance
  // Needs to find the reference point first
  console.log("findDistancesForAllElements@findPaths.js");
  /* Get or build reference element */
  let referenceElements = nodes.filter((x) => x.isReferenceValue);
  let midpoint = Math.round(nodes.length / 2);
  let referenceElement =
    referenceElements.length > 0 ? referenceElements[0] : nodes[midpoint];
  console.log(`referenceElement.position: ${referenceElement.position}`);

  /* Get distances. */
  let distances = nodes.map((node) => {
    if (node.isReferenceValue || node.id == referenceElement.id) {
      return [1];
    } else {
      console.log("node");
      console.log(node);
      let distance = findDistance({
        sourceElementId: referenceElement.id,
        sourceElementPosition: referenceElement.position,
        targetElementId: node.id,
        targetElementPosition: node.position,
        nodes: nodes,
        links: links,
      });
      return distance;
    }
  });
  distances = await Promise.all(distances);
  return distances;
}

export async function buildRows({
  isListOrdered,
  orderedList,
  listOfElements,
  links,
  rows,
  setTableRows,
}) {
  console.log("buildRows@findPaths.js");
  // This function is used in pages/comparisonView.js to create the rows that will be displayed.
  // it is in there because it needs to be deployed after isListOrdered becomes true,
  // and using an useEffect inside CreateTable was too messy.
  if (
    isListOrdered &&
    !(orderedList.length < listOfElements.length) &&
    rows.length == 0
  ) {
    let nodes = [];
    let positionDictionary = {};
    orderedList.forEach((id, pos) => {
      nodes.push({ ...listOfElements[id], position: pos });
      positionDictionary[id] = pos;
    });
    links = links.map((link) => ({
      ...link,
      sourceElementPosition: positionDictionary[link.source],
      targetElementPosition: positionDictionary[link.target],
    }));

    let distances = await findDistancesForAllElements({ nodes, links });
    rows = nodes.map((element, i) => ({
      id: numToAlphabeticalString(element.position),
      position: element.position,
      name: element.name,
      distances: distances[i],
    }));
    console.log(rows);
    setTableRows(rows);
  }
}

export function CreateTable({ tableRows }) {
  /* This function receives a list of rows, and displays them nicely. */
  function abridgeArrayAndDisplay(array) {
    let newArray;
    let formatForDisplay;
    if (array.length > 10) {
      newArray = array.slice(0, 9);
      formatForDisplay = newArray.map((d) => formatLargeOrSmall(d));
      formatForDisplay[9] = "...";
    } else {
      newArray = array;
      formatForDisplay = newArray.map((d) => formatLargeOrSmall(d));
    }
    let result = JSON.stringify(formatForDisplay, null, 2).replaceAll(`"`, "");
    return result;
  }
  return (
    <div>
      <table className="w-full">
        <thead>
          <tr>
            <th>Id</th>
            <th>&nbsp;&nbsp;&nbsp;</th>
            <th>Position</th>
            <th>&nbsp;&nbsp;&nbsp;</th>
            <th>Element</th>
            <th> &nbsp;&nbsp;&nbsp;</th>
            <th>Possible relative values</th>
            <th> &nbsp;&nbsp;&nbsp;</th>
            <th>Average relative value</th>
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row) => (
            <tr key={row.id}>
              <td className="">{row.id}</td>
              <td>&nbsp;&nbsp;&nbsp;</td>
              <td className="">{row.position}</td>
              <td>&nbsp;&nbsp;&nbsp;</td>
              <td className="">{row.name}</td>
              <td>&nbsp;&nbsp;&nbsp;</td>
              <td className="">{abridgeArrayAndDisplay(row.distances)}</td>
              <td>&nbsp;&nbsp;&nbsp;</td>
              <td className="">
                {formatLargeOrSmall(geomMean(row.distances))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* Testing */
//import fs from 'fs';
//import path from 'path';
/*
const directory = path.join(process.cwd(),"pages")
let links = JSON.parse(fs.readFileSync(path.join(directory, 'distancesExample.json'), 'utf8'));
let nodes = JSON.parse(fs.readFileSync(path.join(directory, 'listOfPosts.json'), 'utf8'));

let paths = findPaths({sourceElementId:2, targetElementId:0, pathSoFar: [], links, nodes, maxLengthOfPath: 2})
console.log(JSON.stringify(paths, null, 2))
*/
/*
let paths = findPaths({sourceElementId:2, targetElementId:0, links, nodes})
console.log(JSON.stringify(paths, null, 2))
*/
/*
let distances = findDistance({sourceElementId:2, targetElementId:4, links, nodes})
console.log(distances)
*/
