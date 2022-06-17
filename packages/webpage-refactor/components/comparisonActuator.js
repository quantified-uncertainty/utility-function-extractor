import React, { useState } from "react";
// import { SubmitButton } from "./submitButton";

export function ComparisonActuator({
  listOfElements,
  pairCurrentlyBeingCompared,
  moveToNextStep,
}) {
  const initialComparisonString = "x to y";
  const [comparisonString, setComparisonString] = useState("x to y");
  const onChangeComparisonString = async (event) =>
    await setComparisonString(event.target.value);

  const onClickSubmitEvent = (event) => {
    // console.log(event.target.value);
    moveToNextStep({
      listOfElements,
      pairCurrentlyBeingCompared,
      comparisonString,
    });
    setComparisonString(initialComparisonString);
  };

  return (
    <div className="flex m-auto w-72">
      <div className="block m-auto text-center">
        <br />
        <label>
          {`... is `}
          <br />
          <input
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
