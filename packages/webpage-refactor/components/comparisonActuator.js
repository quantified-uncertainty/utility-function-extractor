import React, { useState } from "react";

export function ComparisonActuator({
  listOfElements,
  pairCurrentlyBeingCompared,
  moveToNextStep,
  isListOrdered,
}) {
  const initialComparisonString = "";
  const [comparisonString, setComparisonString] = useState(
    initialComparisonString
  );
  const onChangeComparisonString = async (event) => {
    if (!isListOrdered) {
      await setComparisonString(event.target.value);
    }
  };

  const onClickSubmitEvent = (event) => {
    if (!isListOrdered) {
      moveToNextStep({
        listOfElements,
        pairCurrentlyBeingCompared,
        comparisonString,
      });
      setComparisonString(initialComparisonString);
    }
  };

  return (
    <div className="flex m-auto w-72">
      <div className="block m-auto text-center">
        <br />
        <label>
          {`... is `}
          <br />
          <input
            disabled={isListOrdered ? true : false}
            placeholder={"x to y"}
            type="text"
            className="text-center text-blueGray-600 bg-white rounded text-lg border-0 shadow outline-none focus:outline-none focus:ring w-8/12 h-10 m-2"
            value={comparisonString}
            onChange={onChangeComparisonString}
          />
          <br />
          {`times as valuable as ...`}
        </label>
        <br />

        <button
          className={
            !true
              ? "bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mt-5"
              : "bg-transparent text-blue-700 font-semibold py-2 px-4 border border-blue-500 rounded mt-5"
          }
          onClick={onClickSubmitEvent}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
