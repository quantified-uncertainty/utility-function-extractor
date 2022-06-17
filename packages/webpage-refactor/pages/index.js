/* Notes */

// This function is just a simple wrapper around lib/comparisonView.
// Most of the time, I'll want to edit that instead

/* Imports */
import React from "react";
import fs from "fs";
import path from "path";
import { Homepage } from "../components/homepage.js";

/* Definitions */
const elementsDocument = "../data/listOfMoralGoods.json";

/* React components */
export async function getStaticProps() {
  const directory = path.join(process.cwd(), "pages");
  let listOfElementsInit = JSON.parse(
    fs.readFileSync(path.join(directory, elementsDocument), "utf8")
  );
  return {
    props: {
      listOfElementsInit,
    },
  };
}

// Main react component
export default function Home({ listOfElementsInit }) {
  return <Homepage listOfElementsInit={listOfElementsInit} />;
}
