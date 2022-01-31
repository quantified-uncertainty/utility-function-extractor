/* Imports */
import React, { useState } from "react";

export function InputBox({
  posList,
  binaryComparisons,
  inputValue,
  reasoning,
  toComparePair,
  nextStepInput,
  dontPushSubmitButtonAnyMore,
}) {
  // This element didn't necessarily have to exist, but it made it easier for debugging purposes
  let onClick = (event) => {
    if (!dontPushSubmitButtonAnyMore) {
      //event.preventDefault();
      let obj = {
        posList,
        binaryComparisons,
        inputValue,
        reasoning,
        element1: toComparePair[1],
        element2: toComparePair[0],
      };
      //
      console.log("input@SubmitInputButton");
      console.log(obj);
      if (!!Number(inputValue) && inputValue >= 0) {
        nextStepInput(obj);
      } else if (!!Number(inputValue) && inputValue < 0) {
        alert("Negative numbers not yet allowed");
      } else {
        alert("Your input is not a number");
      }
    }
  };

  return (
    <button
      className={
        !dontPushSubmitButtonAnyMore
          ? "bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mt-5"
          : "bg-transparent text-blue-700 font-semibold py-2 px-4 border border-blue-500 rounded mt-5"
      }
      onClick={onClick}
    >
      Submit
    </button>
  );
}
