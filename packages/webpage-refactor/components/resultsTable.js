import React, { useState, useEffect } from "react";
import { findDistances, aggregatePaths } from "utility-tools";

import { Separator } from "./separator.js";

import { truncateValueForDisplay } from "../lib/truncateNums.js";
import { cutOffLongNames } from "../lib/stringManipulations.js";
import { getCoefficientOfVariation } from "../lib/coefficientOfVariation.js";

async function fullResultsTable({ listAfterMergeSort, links }) {
  console.log("listAfterMergeSort", listAfterMergeSort);
  console.log(links);
  let pathsArray = await findDistances({
    orderedList: listAfterMergeSort,
    links: links,
  });
  let aggregatedPaths = await aggregatePaths({
    pathsArray: pathsArray,
    orderedList: listAfterMergeSort,
    aggregationType: "mean",
    // VERBOSE: false,
  });
  return aggregatedPaths;
}

function abridgeArrayAndDisplay(array) {
  let newArray;
  let formatForDisplay;
  if (array.length > 10) {
    newArray = array.slice(0, 9);
    formatForDisplay = newArray.map((d) => truncateValueForDisplay(d));
    formatForDisplay[9] = "...";
  } else {
    newArray = array;
    formatForDisplay = newArray.map((d) => truncateValueForDisplay(d));
  }
  let result = JSON.stringify(formatForDisplay, null, 2).replaceAll(`"`, "");
  return result;
}

function getRow(row, i) {
  return (
    <tr
      className="border-b dark:bg-gray-800 dark:border-gray-700 odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700"
      key={`row-display-${i}`}
    >
      <td className="px-6 py-4 pt-7">{i}</td>
      <td className="px-6 py-4">{cutOffLongNames(row.name)}</td>
      <td className="text-center px-6 py-4">
        {abridgeArrayAndDisplay(row.arrayMeans)}
      </td>
      <td className="text-center  px-6 py-4">
        {truncateValueForDisplay(row.aggregatedMeans)}
      </td>
      <td className="text-center  px-6 py-4">
        {truncateValueForDisplay(getCoefficientOfVariation(row.arrayMeans))}
      </td>
    </tr>
  );
}

function reactTableContents(tableContents) {
  return tableContents.map((row, i) => getRow(row, i));
}

export function ResultsTable({ isListOrdered, listAfterMergeSort, links }) {
  const [isTableComputed, setIsTableComputed] = useState(false);
  const [tableContents, setTableContents] = useState([]);

  useEffect(() => {
    let iAsync = async () => {
      if (isListOrdered && listAfterMergeSort.length > 0) {
        // both comparisons aren't strictly necessary,
        // but it bit me once, so I'm leaving it
        let tableContentsResult = await fullResultsTable({
          listAfterMergeSort,
          links,
        });
        console.log(tableContentsResult);
        setTableContents(tableContentsResult);
        setIsTableComputed(true);
      }
      return () => console.log("cleanup");
    };
    iAsync();
  }, [isListOrdered, listAfterMergeSort, links]);

  return !(isListOrdered && isTableComputed) ? (
    ""
  ) : (
    <div>
      <div>
        <Separator />
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
          <table className="w-full text-sm text-left text-gray-800 dark:text-gray-400">
            <thead className=" text-xs text-gray-700  bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Position
                </th>

                <th scope="col" className="px-6 py-3">
                  Element
                </th>

                <th scope="col" className="text-center px-6 py-3">
                  Possible relative values
                </th>

                <th scope="col" className="text-center px-6 py-3">
                  Aggregated Means*
                </th>
                <th scope="col" className="text-center px-6 py-3">
                  Coefficient of variation
                </th>
              </tr>
            </thead>
            <tbody>{reactTableContents(tableContents)}</tbody>
          </table>
        </div>
      </div>
      <div className="grid w-full place-items-center text-center ">
        <p className="mt-8  max-w-5xl">
          *This is the geometric mean of all means of paths if all elements are
          either all positive or all negative, and the arithmetic mean
          otherwise. Paths with a non-numeric mean (e.g., resulting from
          dividing by a mean of 0) are ignored. For a principled aggregation
          which is able to produce meaningfull 90% confidence intervals, see the{" "}
          <a
            href="https://github.com/quantified-uncertainty/utility-function-extractor/tree/master/packages/utility-tools"
            target="_blank"
          >
            utility-tools package
          </a>{" "}
          in npm or Github
        </p>
      </div>
    </div>
  );
}
