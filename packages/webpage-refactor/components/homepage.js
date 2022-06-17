import React, { useState } from "react";
import { Title } from "./title.js";
import { ProgressIndicator } from "./progressIndicator.js";
import { DisplayElementForComparison } from "./displayElementForComparison.js";

import { ComparisonActuator } from "./comparisonActuator.js";

export function Homepage({ listOfElementsInit }) {
  /* Statefull elements */
  const [listOfElements, setListOfElements] = useState(listOfElementsInit);

  const numStepsInit = 0;
  const [numStepsNow, setNumStepsNow] = useState(numStepsInit);
  const increaseNumSteps = (n) => setNumStepsNow(n + 1);

  const isListOrdered = false;

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
            dataProps={{ listOfElements }}
            onSubmit={chooseNextPairToCompareRandomly}
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
