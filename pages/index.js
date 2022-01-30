/* Notes */

// This function is just a simple wrapper around lib/comparisonView.
// Most of the time, I'll want to edit that instead

/* Imports */
import React from "react";
import fs from "fs";
import path from "path";
import ComparisonView from "../lib/comparisonView.js";

/* Definitions */
const elementsDocument = "../data/listOfMoralGoods.json";

/* React components */
export async function getStaticProps() {
  const directory = path.join(process.cwd(), "pages");
  let listOfElementsForView = JSON.parse(
    fs.readFileSync(path.join(directory, elementsDocument), "utf8")
  );
  return {
    props: {
      listOfElementsForView,
    },
  };
}

// Main react component
export default function Home({ listOfElementsForView }) {
  return <ComparisonView listOfElementsForView={listOfElementsForView} />;
}

