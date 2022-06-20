/* Functions */

const pathPlusLink = (pathSoFar, link) => {
  return [...pathSoFar, link];
  // previously: pathSoFar.concat(link).flat()
  // Note that concat is not destructive
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat
};

const findElementPosition = (name, nodes) => {
  let node = nodes.find((node) => node.name == name);
  return node.position;
};

async function findPathsWithoutPrunning({
  // DO NOT DELETE THIS UN-USED FUNCTION
  // USEFUL FOR UNDERSTANDING AGAIN HOW THIS CODE WORKS AFTER A FEW MONTHS
  sourceElementName,
  targetElementName,
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
        (link.source == sourceElementName &&
          link.target == targetElementName) ||
        (link.source == targetElementName && link.target == sourceElementName)
      ) {
        // direct Path
        let newPath = pathPlusLink(pathSoFar, link);
        paths.push(newPath);
      } else if (link.source == sourceElementName) {
        let newPaths = await findPaths({
          pathSoFar: pathPlusLink(pathSoFar, link),
          maxLengthOfPath: maxLengthOfPath - 1,
          sourceElementName: link.target,
          targetElementName,
          links: links, // vs let link of linksInner in findPaths
          nodes,
        });
        if (newPaths.length != 0) {
          paths.push(...newPaths);
        }
      } else if (link.target == sourceElementName) {
        let newPaths = await findPaths({
          pathSoFar: pathPlusLink(pathSoFar, link),
          maxLengthOfPath: maxLengthOfPath - 1,
          sourceElementName: link.source,
          targetElementName,
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
  sourceElementName,
  sourceElementPosition,
  targetElementName,
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
    (link) =>
      link.source == sourceElementName || link.target == sourceElementName
  );

  /* Path traversing */
  if (maxLengthOfPath > 0) {
    for (let link of linksNow) {
      if (
        (link.source == sourceElementName &&
          link.target == targetElementName) ||
        (link.source == targetElementName && link.target == sourceElementName)
      ) {
        // We have found a direct path.
        let newPath = pathPlusLink(pathSoFar, link);
        paths.push(newPath);
      } else if (link.source == sourceElementName) {
        // Recursively call find Paths
        let newPaths = await findPaths({
          pathSoFar: pathPlusLink(pathSoFar, link),
          maxLengthOfPath: maxLengthOfPath - 1,
          sourceElementPosition: link.sourceElementPosition,
          sourceElementName: link.target,
          targetElementName,
          targetElementPosition,
          links: linksInner,
          nodes,
        });
        if (newPaths.length != 0) {
          paths.push(...newPaths);
        }
      } else if (link.target == sourceElementName) {
        let newPaths = await findPaths({
          pathSoFar: pathPlusLink(pathSoFar, link),
          maxLengthOfPath: maxLengthOfPath - 1,
          sourceElementPosition: link.sourceElementPosition,
          sourceElementName: link.source,
          targetElementPosition,
          targetElementName,
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

async function findExpectedValuesAndDistributionsForElement({
  sourceElementName,
  sourceElementPosition,
  targetElementName,
  targetElementPosition,
  nodes,
  links,
}) {
  // This function gets all possible paths using findPaths
  // then orders them correctly in the for loop
  // (by flipping the distance to 1/distance when necessary)
  // and then gets the array of weights for the different paths.

  let maxLengthOfPath = Math.abs(sourceElementPosition - targetElementPosition);
  let paths = await findPaths({
    sourceElementName,
    sourceElementPosition,
    targetElementName,
    targetElementPosition,
    links,
    nodes,
    maxLengthOfPath,
    pathSoFar: [],
  });

  let processedPaths = [];
  for (let path of paths) {
    let currentSource = sourceElementName;
    let expectedRelativeValue = 1;
    let multipliedDistributionsInPath = 1;
    let distances = [];
    for (let element of path) {
      let distance = 0;
      let anotherDistributionInPath = 1;
      if (element.source == currentSource) {
        distance = element.distance;
        anotherDistributionInPath = element.squiggleString;
        currentSource = element.target;
      } else if (element.target == currentSource) {
        distance = 1 / Number(element.distance);
        anotherDistributionInPath = `1 / (${element.squiggleString})`;
        currentSource = element.source;
      }
      expectedRelativeValue = expectedRelativeValue * distance;
      distances.push(distance);
      multipliedDistributionsInPath = `${multipliedDistributionsInPath} * (${anotherDistributionInPath})`;
    }
    processedPaths.push({
      distances,
      expectedRelativeValue,
      multipliedDistributionsInPath,
      // path,
    });
  }
  return processedPaths;
}

async function findDistancesFromAllElementsToReferencePoint({
  nodes,
  links,
  referenceElement,
}) {
  // Simple wrapper function around findDistance
  // Needs to find the reference point first
  // console.log("findDistancesForAllElements@findPaths.js");
  /* Get or build reference element */
  let midpoint = Math.round(nodes.length / 2);
  referenceElement = referenceElement || nodes[midpoint];

  /* Get distances. */
  let distancesArray = nodes.map((node) => {
    if (node.name == referenceElement.name) {
      return [1];
    } else {
      let expectedValuesAndDistributionsForElement =
        findExpectedValuesAndDistributionsForElement({
          sourceElementName: referenceElement.name,
          sourceElementPosition: referenceElement.position,
          targetElementName: node.name,
          targetElementPosition: node.position,
          nodes: nodes,
          links: links,
        });
      return expectedValuesAndDistributionsForElement;
    }
  });
  distancesArray = await Promise.all(distancesArray);
  return distancesArray;
}

export async function findDistancesFromAllElementsToAllReferencePoints({
  nodes,
  links,
}) {
  let nodes2 = nodes.map((node) => ({ ...node, isReferenceValue: false }));
  let distancesForAllElements = Array(nodes.length);
  for (let i = 0; i < nodes.length; i++) {
    distancesForAllElements[i] = [];
  }
  for (let node of nodes2) {
    let distancesFromNode = await findDistancesFromAllElementsToReferencePoint({
      nodes: nodes2,
      links,
      referenceElement: node,
    });
    distancesForAllElements = distancesForAllElements.map((arr, i) => {
      return !!arr && arr.length > 0
        ? [...arr, ...distancesFromNode[i]]
        : distancesFromNode[i];
    });
  }
  return distancesForAllElements;
}

export async function findDistances({ orderedList, links }) {
  let nodes = orderedList.map((element, i) => ({
    ...element,
    position: i,
  }));
  const linksWithPosition = links.map((link) => ({
    ...link,
    sourceElementPosition: findElementPosition(link.source, nodes),
    targetElementPosition: findElementPosition(link.target, nodes),
  }));
  let result = await findDistancesFromAllElementsToAllReferencePoints({
    nodes,
    links: linksWithPosition,
  });
  return result;
}
