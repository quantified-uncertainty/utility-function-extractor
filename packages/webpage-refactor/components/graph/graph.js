import React, { useEffect, useState, useRef } from "react";
import colormap from "colormap";
import cytoscape from "cytoscape";

import {
  resolveToNumIfPossible,
  getSquiggleSparkline,
} from "../../lib/squiggle.js";
import { truncateValueForDisplay } from "../../lib/truncateNums.js";
import { cutOffLongNames } from "../../lib/stringManipulations.js";

// import spread from "cytoscape-spread";
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

  return squiggleString + sparklineConcat;
};

const getColors = (n) => {
  let colors;
  if (n >= 9) {
    colors = colormap({
      colormap: "viridis",
      nshades: n,
      format: "hex",
      alpha: 1,
    });
  } else {
    colors = colormap({
      colormap: "greys", // other themes: hot, winter, etc.
      nshades: n,
      format: "hex",
      alpha: 1,
    });
  }
  return colors;
};

export function Graph({
  listOfElements,
  links,
  isListOrdered,
  listAfterMergeSort,
}) {
  const containerRef = useRef("hello-world");
  const [visibility, setVisibility] = useState(""); /// useState("invisible");

  const callEffect = async ({
    listOfElements,
    links,
    isListOrdered,
    listAfterMergeSort,
  }) => {
    //setVisibility("invisible");
    let layoutName = "circle"; //

    // cytoscape.use(spread); // necessary for non-default themes,
    let listOfElementsForGraph = isListOrdered
      ? listAfterMergeSort
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
          labelColor: isListOrdered
            ? i >= listOfElementsForGraph.length - 2
              ? "black"
              : "white"
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
        },
      },
    ];

    const config = {
      container: containerRef.current,
      style: cytoscapeStylesheet,
      elements: [...nodeElements, ...linkElements],
      layout: {
        name: layoutName, // circle, grid, dagre
        minDist: 10,
        //prelayout: false,
        // animate: false, // whether to transition the node positions
        // animationDuration: 250, // duration of animation in ms if enabled
        // the cytoscape documentation is pretty good here.
      },
      userZoomingEnabled: false,
      userPanningEnabled: false,
    };
    cytoscape(config);
    // setTimeout(() => setVisibility(""), 700);
    // necessary for themes like spread, which have
    // a confusing animation at the beginning
  };
  useEffect(async () => {
    await callEffect({
      listOfElements,
      links,
      isListOrdered,
      listAfterMergeSort,
    });
  }, [listOfElements, links, isListOrdered, listAfterMergeSort]);

  return (
    <div className="">
      <div className={visibility + "grid grid-cols-1 place-items-center "}>
        <div
          ref={containerRef}
          style={{
            height: "900px", // isListOrdered ? "900px" : "500px",
            width: "900px", // isListOrdered ? "900px" : "500px",
          }}
        />
      </div>
      <button
        className={effectButtonStyle}
        onClick={() =>
          callEffect({
            listOfElements,
            links,
            isListOrdered,
            listAfterMergeSort,
          })
        }
      >
        {"Redraw graph"}
      </button>
    </div>
  );
}
