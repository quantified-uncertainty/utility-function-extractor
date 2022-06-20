import React from "react";
// import { SquiggleChart } from "@quri/squiggle-components";

import dynamic from "next/dynamic";

const SquiggleChart = dynamic(
  () => import("@quri/squiggle-components").then((mod) => mod.SquiggleChart),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);
/*
const SquiggleChart = dynamic(
  () => import("@quri/squiggle-components").then((mod) => mod.SquiggleChart),
  {
    suspense: true,
    ssr: false,
  }
);
*/

const effectButtonStyle =
  "bg-transparent m-2 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mt-5";

export function DynamicSquiggleChart({ link, stopShowing }) {
  if (link == null) {
    return "";
  } else {
    let usefulLink = {
      source: link.source,
      target: link.target,
      squiggleString: link.squiggleString,
    };
    return (
      <div className="">
        <textarea
          value={JSON.stringify(usefulLink, null, 4)}
          //onChange={handleChange}
          disabled={true}
          rows={JSON.stringify(usefulLink, null, 4).split("\n").length}
          cols={37}
          className="text-left text-gray-600 bg-white rounded text-normal p-6  border-0 shadow outline-none focus:outline-none focus:ring mb-4"
        />
        <SquiggleChart
          squiggleString={link.squiggleString}
          width={445}
          height={200}
          showSummary={true}
          showTypes={true}
        />
        {/*
            SquiggleChart props:
            squiggleString?: string;
            sampleCount?: number;
            environment?: environment;
            chartSettings?: FunctionChartSettings;
            onChange?(expr: squiggleExpression): void;
            width?: number;
            height?: number;
            bindings?: bindings;
            jsImports?: jsImports;
            showSummary?: boolean;
            showTypes?: boolean;
            showControls?: boolean;
        */}

        <button className={effectButtonStyle} onClick={() => stopShowing()}>
          Hide chart
        </button>
      </div>
    );
  }
}
