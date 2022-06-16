import React from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function (str, newStr) {
    // If a regex pattern
    if (
      Object.prototype.toString.call(str).toLowerCase() === "[object regexp]"
    ) {
      return this.replace(str, newStr);
    }

    // If a string
    return this.replace(new RegExp(str, "g"), newStr);
  };
}

export function DisplayAsMarkdown({ markdowntext, className }) {
  //console.log(markdowntext)
  markdowntext = markdowntext.replaceAll("\n", "\n\n");
  return (
    <ReactMarkdown
      plugins={[gfm]}
      children={markdowntext}
      className={className}
    />
  );
}

