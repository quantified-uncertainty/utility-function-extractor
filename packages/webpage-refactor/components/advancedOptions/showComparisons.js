import React, { state } from "react";
import { CopyBlock, googlecode } from "react-code-blocks";
import { Separator } from "../separator.js";
// googlecode

export function ShowComparisons({ links, show }) {
  return (
    <div className={`text-left ${show ? "" : "hidden"}`}>
      <Separator />
      <h3 className="text-lg mt-8">Comparisons</h3>
      <CopyBlock
        text={JSON.stringify(links, null, 4)}
        language={"js"}
        showLineNumbers={false}
        startingLineNumber={0}
        wrapLines={true}
        textColor={"black"}
        theme={googlecode}
        codeBlock={true}
      />
    </div>
  );
}
