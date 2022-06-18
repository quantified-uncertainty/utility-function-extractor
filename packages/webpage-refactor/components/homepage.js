import React, { useState } from "react";
import { mergeSort } from "utility-tools";

import { ProgressIndicator } from "./progressIndicator.js";
import { DisplayElementForComparison } from "./displayElementForComparison.js";
import { ComparisonActuator } from "./comparisonActuator.js";
import { AdvancedOptions } from "./advancedOptions.js";
import { Graph } from "./graph/graph.js";
import { resolveToNumIfPossible } from "../lib/squiggle.js";

export function Homepage({ listOfElementsInit }) {
  /* Statefull elements */

  // list of elements
  const [listOfElements, setListOfElements] = useState(
    listOfElementsInit.slice(0, 5)
  );

  // number of steps
  const numStepsInit = 0;
  const [numStepsNow, setNumStepsNow] = useState(numStepsInit);

  // is list ordered?
  const [isListOrdered, setIsListOrdered] = useState(false);

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

  // dataset changer
  const onChangeOfDataset = (newListOfElements) => {
    setListOfElements(newListOfElements);
    setLinks([]);
    setPairCurrentlyBeingCompared([newListOfElements[0], newListOfElements[1]]);
    setNumStepsNow(0);
    setIsListOrdered(false);
  };

  // process next step
  const mergeSortStep = ({ list, links }) => {
    let mergeSortOutput = mergeSort({
      list: list,
      links: links,
    });
    setNumStepsNow(numStepsNow + 1);
    if (mergeSortOutput.finishedOrderingList == false) {
      let newPairToCompare = mergeSortOutput.uncomparedElements;
      setIsListOrdered(false);
      setPairCurrentlyBeingCompared(newPairToCompare);
    } else {
      setIsListOrdered(true);
      alert(JSON.stringify(mergeSortOutput, null, 4));
      // chooseNextPairToCompareRandomly({ listOfElements });
      // return 1;
    }
  };

  // full
  const moveToNextStep = async ({
    listOfElements,
    pairCurrentlyBeingCompared,
    comparisonString,
    whileChangingStuff,
    newLinksFromChangingStuff,
  }) => {
    // In the normal course of things:
    if (!whileChangingStuff) {
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
        /// let newLinks = [...links, { ...newLink, distance: numOption.num }];
        newLink = { ...newLink, distance: numOption.num };
        addLink(newLink, links);
        let newLinks = [...links, newLink];
        console.log("links: ", links);
        mergeSortStep({ list: listOfElements, links: newLinks });
      }
    } else {
      mergeSortStep({
        list: listOfElements,
        links: newLinksFromChangingStuff,
      });
      setNumStepsNow(0); // almost no guarantees of how many left.
    }

    // When changing comparisons:
  };

  return (
    <div>
      <ProgressIndicator
        numStepsNow={numStepsNow}
        numElements={listOfElements.length}
      />
      {/* Comparisons section */}
      <div className={"" /*isListOrdered ? "hidden" : ""*/}>
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
      </div>
      {/* <Graph /> 
      
      */}

      {/* Advanced options section */}
      <div>
        <AdvancedOptions
          links={links}
          setLinks={setLinks}
          listOfElements={listOfElements}
          moveToNextStep={moveToNextStep}
          onChangeOfDataset={onChangeOfDataset}
        />
      </div>

      <Graph listOfElements={listOfElements} links={links} />
    </div>
  );
}
