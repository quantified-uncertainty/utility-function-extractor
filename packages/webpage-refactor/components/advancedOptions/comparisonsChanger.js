import React, { useState, useEffect } from "react";
import { Separator } from "../separator.js";

const checkLinksAreOk = (links, listOfElements) => {
  let linkSourceNames = links.map((link) => link.source.name);
  let linkTargetNames = links.map((link) => link.target.name);
  let allLinkNames = [...linkSourceNames, ...linkTargetNames];
  let uniqueNames = [...new Set(allLinkNames)];

  let listOfElementNames = listOfElements.map((element) => element.name);
  let anyInvalidNames = uniqueNames.indexOf(
    (name) => !listOfElementNames.includes(name)
  );
  let anyElementsWithoutDistances = links.indexOf(
    (link) => !link.distance && link.distance != 0
  );
  if (anyInvalidNames == -1 && anyElementsWithoutDistances == -1) {
    return true;
  } else {
    return false;
  }
};

export function ComparisonsChanger({
  setLinks,
  listOfElements,
  show,
  moveToNextStep,
  links,
}) {
  let [value, setValue] = useState(JSON.stringify(links, null, 4));
  const [displayingDoneMessage, setDisplayingDoneMessage] = useState(false);
  const [displayingDoneMessageTimer, setDisplayingDoneMessageTimer] =
    useState(null);

  let handleTextChange = (event) => {
    setValue(event.target.value);
  };

  let handleSubmitInner = (event) => {
    clearTimeout(displayingDoneMessageTimer);
    event.preventDefault();

    try {
      let newData = JSON.parse(value);

      if (checkLinksAreOk(newData, listOfElements)) {
        setLinks(newData);
        moveToNextStep({
          listOfElements,
          whileChangingStuff: true,
          newLinksFromChangingStuff: newData,
        });
        setDisplayingDoneMessage(true);
        let timer = setTimeout(() => setDisplayingDoneMessage(false), 3000);
        setDisplayingDoneMessageTimer(timer);
      } else {
        throw Error("Links are not ok");
      }
    } catch (error) {
      setDisplayingDoneMessage(false);
      alert(error);
    }
  };

  useEffect(async () => {
    setValue(JSON.stringify(links, null, 4));
    return () => console.log("cleanup");
  }, [links]);

  return (
    <form
      onSubmit={handleSubmitInner}
      className={`inline ${show ? "" : "hidden"}`}
    >
      <Separator />
      <h3 className="text-lg mt-8">Load comparisons</h3>
      <p>These can be edited, which will override your current comparisons.</p>
      <br />
      <textarea
        value={value}
        onChange={handleTextChange}
        rows={4 + JSON.stringify(links, null, 4).split("\n").length}
        cols={90}
        className="text-left text-gray-600 bg-white rounded text-normal p-10 border-0 shadow outline-none focus:outline-none focus:ring "
      />
      <br />
      <button
        className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mt-5 p-10"
        onClick={handleSubmitInner}
      >
        Change comparisons
      </button>
      &nbsp;
      <button
        className={
          displayingDoneMessage
            ? "bg-transparent text-blue-700 font-semibold py-2 px-4 border border-blue-500 rounded mt-5 p-10"
            : "hidden"
        }
      >
        Done!
      </button>
    </form>
  );
}
