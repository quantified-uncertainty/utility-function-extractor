import React, { useEffect, useState, useRef } from "react";
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
import avsdf from "cytoscape-avsdf";

const effectButtonStyle =
  "bg-transparent m-2 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mt-5";

const getEdgeLabel = async (squiggleString) => {
  let sparkline = await getSquiggleSparkline(squiggleString);
  let num = await resolveToNumIfPossible(squiggleString);

  let sparklineConcat = "";
  if (false && sparkline.success) {
    console.log(sparkline);

    sparklineConcat =
      sparklineConcat +
      " →" +
      sparkline.sparkline.replace("▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁", "");
    //alert("▁▁▁▁▁▁▁▁▁▁▁");
  }
  if (num.asNum) {
    sparklineConcat =
      sparklineConcat + " ⇾ " + truncateValueForDisplay(num.num);
    //alert("▁▁▁▁▁▁▁▁▁▁▁");
  }

  return squiggleString + sparklineConcat; //sparkline;
};

export function Graph({ listOfElements, links }) {
  const containerRef = useRef();

  const callEffect = async (listOfElements, links) => {
    cytoscape.use(spread); // spread

    let nodeElements = listOfElements.map((element) => {
      return { data: { id: element.name } };
    });
    let linkElements = await Promise.all(
      links.map(async (link, i) => {
        return {
          data: {
            id: `link-${i}`,
            source: link.source,
            target: link.target,
            label: await getEdgeLabel(link.squiggleString),
          },
        };
      })
    );
    const config = {
      container: containerRef.current,
      style: [
        {
          selector: "node",
          style: {
            content: "data(id)",
            "background-color": "darkgreen",
            "text-wrap": "wrap",
            "text-max-width": 200,
            "source-text-offset": 20,
            //"text-valign": "bottom",
            "text-justification": "auto",
          },
          padding: 10,
        },
        {
          selector: "edge",
          style: {
            label: "data(label)", // maps to data.label
            labelColor: "blue",
            "curve-style": "unbundled-bezier",
            "target-arrow-color": "green",
            "arrow-scale": 3,
            "target-arrow-fill": "filled",
            "font-size": 15,
            "line-color": "green",
            "target-arrow-shape": "vee",
            "text-rotation": "autorotate",
            "text-margin-x": +25,
            "text-margin-y": +25,
            padding: 5,
          },
        },
      ],
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
        name: "spread", // circle, grid, dagre
        minDist: 10,
        //prelayout: false,
        //animate: "end", // whether to transition the node positions
        animationDuration: 0, // duration of animation in ms if enabled
      },
      userZoomingEnabled: false,
      userPanningEnabled: false,
    };
    cytoscape(config);
  };
  useEffect(async () => {
    await callEffect(listOfElements, links);
    // console.log(JSON.stringify(config, null, 10));
  }, [listOfElements, links]);

  return (
    <div>
      <div ref={containerRef} style={{ height: "700px", width: "1000px" }} />
      <button
        className={effectButtonStyle}
        onClick={() => callEffect(listOfElements, links)}
      >
        {"Redraw graph"}
      </button>
    </div>
  );
}
