import { SimpleReactCytoscape } from "simple-react-cytoscape";
import { Core } from "cytoscape";
import { useCallback, useState } from "react";

/*
const elements = [
  // list of graph elements to start with
  {
    // node a
    data: { id: "a" },
  },
  {
    // node b
    data: { id: "b" },
  },
  {
    // node c
    data: { id: "c" },
  },
  {
    // edge ab
    data: { id: "ab", source: "a", target: "b" },
  },
  {
    // edge ab
    data: { id: "ac", source: "a", target: "c" },
  },
];
*/

const style = [
  // the stylesheet for the graph
  {
    selector: "node",
    style: {
      "background-color": "#666",
      label: "data(id)",
    },
  },

  {
    selector: "edge",
    style: {
      width: 3,
      "line-color": "#ccc",
      "target-arrow-color": "#ccc",
      "target-arrow-shape": "triangle",
      "curve-style": "bezier",
    },
  },
];

export function Graph({ listOfElements, links }) {
  const [myCy, setMyCy] = useState();

  const cyCallback = useCallback(
    (cy) => {
      setMyCy(cy);
    },
    [listOfElements, links]
  );

  let nodeElements = listOfElements.map((element) => {
    return { data: { id: element.name } };
  });
  let linkElements = links.map((link, i) => {
    return {
      data: {
        id: `link-i`,
        source: link.source,
        target: link.target,
        label: link.distance,
      },
    };
  });
  let elements = [...nodeElements, ...linkElements];
  let options = {
    elements,
    style,
  };
  return (
    <div className="App">
      <p>"a"</p>
      <SimpleReactCytoscape options={options} cyCallback={cyCallback} />
      <h3>JSON representation</h3>
      {/*<p>{myCy && JSON.stringify(myCy.json())}</p>*/}
    </div>
  );
}
