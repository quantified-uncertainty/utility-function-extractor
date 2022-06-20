import React, { useState } from "react";
import { mergeSort } from "utility-tools";

import { Title } from "./title.js";
import { ProgressIndicator } from "./progressIndicator.js";
import { DisplayElementForComparison } from "./displayElementForComparison.js";
import { ComparisonActuator } from "./comparisonActuator.js";
import { Separator } from "./separator.js";
import { ResultsTable } from "./resultsTable.js";

import { AdvancedOptions } from "./advancedOptions/advancedOptions.js";
import { Graph } from "./graph/graph.js";
import { pushToMongo } from "../lib/pushToMongo.js";
import { resolveToNumIfPossible } from "../lib/squiggle.js";

export function Homepage({ listOfElementsInit }) {
  const SLICE = false;

  /* Statefull elements */

  // list of elements
  const [listOfElements, setListOfElements] = useState(
    SLICE ? listOfElementsInit.slice(0, 4) : listOfElementsInit
  );

  // number of steps
  const numStepsInit = 0;
  const [numStepsNow, setNumStepsNow] = useState(numStepsInit);

  // is list ordered?
  const [isListOrdered, setIsListOrdered] = useState(false);
  const [listAfterMergeSort, setListAfterMergeSort] = useState([]);

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

  /* Effects */

  // dataset changer
  const onChangeOfDataset = (newListOfElements) => {
    setListOfElements(newListOfElements);
    setLinks([]);
    setPairCurrentlyBeingCompared([newListOfElements[0], newListOfElements[1]]);
    setNumStepsNow(0);
    setIsListOrdered(false);
    setListAfterMergeSort([]);
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
      setListAfterMergeSort(mergeSortOutput.orderedList);
      pushToMongo({ mergeSortOutput, links });
      setIsListOrdered(true); // should be at the end, because some useEffects are triggered by it.
    }
  };

  // Main mergesort step
  const moveToNextStep = async ({
    listOfElements,
    pairCurrentlyBeingCompared,
    comparisonString,
    whileChangingStuff,
    newLinksFromChangingStuff,
  }) => {
    if (!whileChangingStuff) {
      // In the normal course of things:
      let newLink = {
        source: pairCurrentlyBeingCompared[0].name,
        target: pairCurrentlyBeingCompared[1].name,
        squiggleString: comparisonString,
      };

      let numOption = await resolveToNumIfPossible(comparisonString);
      if (numOption.asNum == false) {
        alert(JSON.stringify(numOption.errorMsg));
      } else if (numOption.asNum == true) {
        newLink = { ...newLink, distance: numOption.num };
        addLink(newLink, links);
        let newLinks = [...links, newLink];
        console.log("links: ", links);
        mergeSortStep({ list: listOfElements, links: newLinks });
      }
    } else {
      // When changing comparisons:
      mergeSortStep({
        list: listOfElements,
        links: newLinksFromChangingStuff,
      });
      setNumStepsNow(0); // almost no guarantees of how many left.
    }
  };

  return (
    <div className="block w-full items-center sm:w-full mt-10">
      <Title />

      <ProgressIndicator
        numStepsNow={numStepsNow}
        numElements={listOfElements.length}
      />

      {/* Comparisons section */}
      <div className={"" /*isListOrdered ? "hidden" : ""*/}>
        <div className="flex justify-evenly mt-10">
          <DisplayElementForComparison
            element={pairCurrentlyBeingCompared[0]}
          ></DisplayElementForComparison>

          <ComparisonActuator
            listOfElements={listOfElements}
            pairCurrentlyBeingCompared={pairCurrentlyBeingCompared}
            moveToNextStep={moveToNextStep}
            isListOrdered={isListOrdered}
          />

          <DisplayElementForComparison
            element={pairCurrentlyBeingCompared[1]}
          ></DisplayElementForComparison>
        </div>
      </div>

      {/* <Results table /> */}
      <ResultsTable
        isListOrdered={isListOrdered}
        listAfterMergeSort={listAfterMergeSort}
        links={links}
      />

      {/* <Graph /> */}
      <Separator />
      <Graph
        listOfElements={listOfElements}
        links={links}
        isListOrdered={isListOrdered}
        listAfterMergeSort={listAfterMergeSort}
      />

      {/* Advanced options section */}
      <Separator />
      <AdvancedOptions
        links={links}
        setLinks={setLinks}
        listOfElements={listOfElements}
        moveToNextStep={moveToNextStep}
        onChangeOfDataset={onChangeOfDataset}
      />
    </div>
  );
}
