import React from "react";

let capitalizeFirstLetter = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export function DisplayElementForComparison({ element }) {
  let otherkeys = Object.keys(element).filter(
    (key) =>
      key != "name" && key != "url" && key != "id" && key != "isReferenceValue"
  );
  let othervalues = otherkeys.map((key) => element[key]);
  let otherpairs = otherkeys.map((key, i) => ({
    key: capitalizeFirstLetter(key),
    value: othervalues[i],
  }));

  if (element.url) {
    return (
      <div className="flex m-auto border-gray-300 border-4 h-72 w-72 p-5">
        <div className="block m-auto text-center">
          <div>
            {/*<a href={element.url} target="_blank">*/}
            <h2>{`${element.name}`}</h2>
            {/*</a>*/}
            {otherpairs.map((pair) => (
              <p key={pair.value}>{`${pair.key}: ${pair.value}`}</p>
            ))}
            <p>
              <a href={element.url} target="_blank">
                More info
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex m-auto border-gray-300 border-4 h-72 w-72 p-5">
        <div className="block m-auto text-center">
          <div>
            <h2>{`${element.name}`}</h2>
            {otherpairs.map((pair) => (
              <p key={pair.value}>{`${pair.key}: ${pair.value}`}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
