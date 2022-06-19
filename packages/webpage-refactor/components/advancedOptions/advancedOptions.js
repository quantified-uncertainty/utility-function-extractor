import React, { useState } from "react";
import { ShowComparisons } from "./showComparisons.js";
import { ComparisonsChanger } from "./comparisonsChanger.js";
import { DataSetChanger } from "./datasetChanger.js";
import { setRevalidateHeaders } from "next/dist/server/send-payload/revalidate-headers.js";

const effectButtonStyle =
  "bg-transparent m-2 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mt-5";

export function AdvancedOptions({
  links,
  setLinks,
  listOfElements,
  moveToNextStep,
  onChangeOfDataset,
}) {
  const [showAdvancedOptions, changeShowAdvanceOptions] = useState(false);

  const [showComparisons, setShowComparisons] = useState(false);
  const toggleShowComparisons = () => setShowComparisons(!showComparisons);

  const [showLoadComparisons, setShowLoadComparisons] = useState(false);
  const toggleShowLoadComparisons = () =>
    setShowLoadComparisons(!showLoadComparisons);

  const [showChangeDataset, setShowChangeDataset] = useState(false);
  const toggleShowChangeDataset = () =>
    setShowChangeDataset(!showChangeDataset);

  const buttonNames = [
    // "Show Comparisons",
    "Load comparisons",
    "Use your own data",
  ];
  const buttonToggles = [
    // toggleShowComparisons,
    toggleShowLoadComparisons,
    toggleShowChangeDataset,
  ];

  return (
    <div className="">
      <br />
      {/* Show advanced options*/}
      <button
        key={"advancedOptionsButton-top"}
        className="text-gray-500 text-sm "
        onClick={() => changeShowAdvanceOptions(!showAdvancedOptions)}
      >
        Advanced options ▼
      </button>
      <br />
      {/* Toggle  buttons */}
      <div className={showAdvancedOptions ? "" : "hidden"}>
        {buttonNames.map((buttonName, i) => {
          return (
            <button
              className={effectButtonStyle}
              onClick={() => buttonToggles[i]()}
              key={`advancedOptionsButton-${i}`}
            >
              {buttonName}
            </button>
          );
        })}
        {/* Element: Show comparisons */}
        <ShowComparisons links={links} show={showComparisons} />
        {/* Element: Change comparisons */}
        <ComparisonsChanger
          setLinks={setLinks}
          listOfElements={listOfElements}
          show={showLoadComparisons}
          moveToNextStep={moveToNextStep}
          links={links}
        />
        <DataSetChanger
          onChangeOfDataset={onChangeOfDataset}
          show={showChangeDataset}
          listOfElements={listOfElements}
        />
      </div>
    </div>
  );
}
