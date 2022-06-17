import React, { useState } from "react";
import { mergeSort } from "utility-tools";

import { Title } from "./title.js";
import { ProgressIndicator } from "./progressIndicator.js";
import { DisplayElementForComparison } from "./displayElementForComparison.js";
import { ComparisonActuator } from "./comparisonActuator.js";
import { resolveToNumIfPossible } from "../lib/squiggle.js";

export function Homepage({ listOfElementsInit }) {
  /* Statefull elements */

  // list of elements
  const [listOfElements, setListOfElements] = useState(
    listOfElementsInit.slice(0, 3)
  );

  // number of steps
  const numStepsInit = 0;
  const [numStepsNow, setNumStepsNow] = useState(numStepsInit);
  const increaseNumSteps = (n) => setNumStepsNow(n + 1);

  // is list ordered?
  const isListOrdered = false;

  // list of comparisons
  const [links, setLinks] = useState([]);
  const addLink = (link, links) => setLinks([...links, link]);

  // paired being currently compared
  const pairCurrentlyBeingComparedInit = [
    listOfElementsInit[0],
    listOfElementsInit[1],
  ];
  const [pairCurrentlyBeingCompared, setPairCurrentlyBeingCompared] = useState(
    pairCurrentlyBeingComparedInit
  );
  const changePairCurrentlyBeingCompared = (element1, element2) =>
    setPairCurrentlyBeingCompared([element1, element2]);
  const chooseNextPairToCompareRandomly = ({ listOfElements }) => {
    let l = listOfElements.length;
    let n1 = Math.floor(Math.random() * l - 0.001) % l;
    let n2 = (n1 + 1 + Math.floor(Math.random() * l)) % l;
    changePairCurrentlyBeingCompared(listOfElements[n1], listOfElements[n2]);
  };

  // process next step
  const moveToNextStep = async ({
    listOfElements,
    pairCurrentlyBeingCompared,
    comparisonString,
  }) => {
    let newLink = {
      source: pairCurrentlyBeingCompared[0].name,
      target: pairCurrentlyBeingCompared[1].name,
      squiggleString: comparisonString,
    };

    let numOption = await resolveToNumIfPossible(comparisonString);
    if (numOption.asNum == false) {
      alert(JSON.stringify(numOption.errorMsg));
    } else if (numOption.asNum == true) {
      // addLink({ ...newLink, distance: numOption.num }, links);
      let newLinks = [...links, { ...newLink, distance: numOption.num }];
      setLinks(newLinks);
      console.log("links: ", newLinks);
      let mergeSortOutput = mergeSort({ list: listOfElements, links: links });
      if (mergeSortOutput.finishedOrderingList == false) {
        let newPairToCompare = mergeSortOutput.uncomparedElements;
        setPairCurrentlyBeingCompared(newPairToCompare);
      } else {
        alert(JSON.stringify(mergeSortOutput, null, 4));
        // chooseNextPairToCompareRandomly({ listOfElements });
        // return 1;
      }
    }
  };

  return (
    <div>
      <Title />
      <ProgressIndicator
        numStepsNow={numStepsNow}
        numElements={listOfElements.length}
      />
      {/* Comparisons section */}
      <div className={isListOrdered ? "hidden" : ""}>
        <div className="flex flex-wrap items-center max-w-4xl sm:w-full mt-10">
          <DisplayElementForComparison
            element={pairCurrentlyBeingCompared[0]}
          ></DisplayElementForComparison>

          <ComparisonActuator
            listOfElements={listOfElements}
            pairCurrentlyBeingCompared={pairCurrentlyBeingCompared}
            moveToNextStep={moveToNextStep}
          />

          <DisplayElementForComparison
            element={pairCurrentlyBeingCompared[1]}
          ></DisplayElementForComparison>
        </div>
        <br />

        <br />
      </div>
    </div>
  );
}
