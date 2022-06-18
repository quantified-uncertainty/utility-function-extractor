import React, { useEffect, useState, useRef } from "react";
import colormap from "colormap";
import cytoscape from "cytoscape";
import spread from "cytoscape-spread";
import {
  resolveToNumIfPossible,
  getSquiggleSparkline,
} from "../../lib/squiggle.js";
import { truncateValueForDisplay } from "../../lib/truncateNums.js";

// import dagre from "cytoscape-dagre";
// import cola from "cytoscape-cola";
// import fcose from "cytoscape-fcose";
// import avsdf from "cytoscape-avsdf";

const effectButtonStyle =
  "bg-transparent m-2 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mt-5";

const getEdgeLabel = async (squiggleString) => {
  let sparkline = await getSquiggleSparkline(squiggleString);
  let num = await resolveToNumIfPossible(squiggleString);

  let sparklineConcat = "";
  if (false && sparkline.success) {
    console.log(sparkline);

    sparklineConcat =
      sparklineConcat + " →" + sparkline.sparkline.replace("▁▁▁▁▁▁▁▁▁▁▁▁▁", "");
    //alert("▁▁▁▁▁▁▁▁▁▁▁");
  }
  if (num.asNum) {
    sparklineConcat =
      sparklineConcat + " ⇾ " + truncateValueForDisplay(num.num);
    //alert("▁▁▁▁▁▁▁▁▁▁▁");
  }

  return squiggleString + sparklineConcat; //sparkline;
};

const getColors = (n) => {
  let colors = colormap({
    colormap: "viridis",
    nshades: n,
    format: "hex",
    alpha: 1,
  });
  return colors;
};

const cutOffLongNames = (string) => {
  let maxLength = 40;
  let result;
  if (string.length < maxLength) {
    result = string;
  } else {
    result = string.slice(0, maxLength - 4);
    result = result + "...";
  }
  return result;
};

export function Graph({
  listOfElements,
  links,
  isListOrdered,
  mergeSortOrder,
}) {
  const containerRef = useRef("hello-world");
  const [visibility, setVisibility] = useState(""); /// useState("invisible");

  const callEffect = async ({
    listOfElements,
    links,
    isListOrdered,
    mergeSortOrder,
  }) => {
    //setVisibility("invisible");
    let layoutName = "circle"; //

    // cytoscape.use(circle); // spread, circle,
    let listOfElementsForGraph = isListOrdered
      ? mergeSortOrder
      : listOfElements;

    let colors = new Array(listOfElements.length);
    if (isListOrdered) {
      colors = getColors(listOfElements.length);
    }

    let nodeElements = listOfElements.map((element, i) => {
      return {
        data: {
          id: cutOffLongNames(element.name),
          color: colors[i] || "darkgreen",
          labelColor:
            isListOrdered && i >= listOfElementsForGraph.length - 2
              ? "black"
              : "white",
        },
      };
    });
    let linkElements = await Promise.all(
      links.map(async (link, i) => {
        return {
          data: {
            id: `link-${i}`,
            source: cutOffLongNames(link.source),
            target: cutOffLongNames(link.target),
            label: await getEdgeLabel(link.squiggleString),
          },
        };
      })
    );

    const cytoscapeStylesheet = [
      {
        selector: "node",
        style: {
          padding: "30px",
          shape: "round-rectangle",
          content: "data(id)",
          "background-color": "data(color)",
          "text-wrap": "wrap",
          //"text-overflow-wrap": "anywhere",
          "text-max-width": 70,
          "z-index": 1,
        },
      },
      {
        selector: "node[id]",
        style: {
          label: "data(id)",
          "font-size": "13",
          color: "data(labelColor)",
          "text-halign": "center",
          "text-valign": "center",
          "z-index": 1,
        },
      },
      {
        selector: "edge",
        style: {
          "curve-style": "unbundled-bezier",
          "target-arrow-shape": "vee",
          width: 1.5,
          "target-arrow-color": "green",
          "arrow-scale": 3,
          "target-arrow-fill": "filled",
          "text-rotation": "autorotate",
          "z-index": 0,
        },
      },
      {
        selector: "edge[label]",
        style: {
          label: "data(label)",
          "font-size": "12",

          "text-background-color": "#f9f9f9",
          "text-background-opacity": 1,
          "text-background-padding": "4px",

          "text-border-color": "black",
          "text-border-style": "solid",
          "text-border-width": 0.5,
          "text-border-opacity": 1,
          "z-index": 3,

          // "text-rotation": "autorotate"
        },
      },
    ];

    const config = {
      container: containerRef.current,
      style: cytoscapeStylesheet,
      elements: [
        /* Dummy data:
        { data: { id: "n1" } },
        { data: { id: "n2" } },
        { data: { id: "e1", source: "n1", target: "n2" } },
        
        Real data:*/
        ...nodeElements,
        ...linkElements,
      ],
      layout: {
        name: layoutName, // circle, grid, dagre
        minDist: 10,
        //prelayout: false,
        // animate: false, // whether to transition the node positions
        // animationDuration: 250, // duration of animation in ms if enabled
      },
      userZoomingEnabled: false,
      userPanningEnabled: false,
    };
    cytoscape(config);
    // setTimeout(() => setVisibility(""), 700);
  };
  useEffect(async () => {
    await callEffect({ listOfElements, links, isListOrdered, mergeSortOrder });
    // console.log(JSON.stringify(config, null, 10));
  }, [listOfElements, links, isListOrdered]);

  return (
    <div>
      <div className={visibility}>
        <div ref={containerRef} style={{ height: "900px", width: "1000px" }} />
      </div>
      <button
        className={effectButtonStyle}
        onClick={() =>
          callEffect({ listOfElements, links, isListOrdered, mergeSortOrder })
        }
      >
        {"Redraw graph"}
      </button>
    </div>
  );
}
