import React, { useEffect, useMemo, useState } from "react";
import cytoscape from "cytoscape";

export function Graph({ listOfElements, links, options, getCy }) {
  const [cy, setCy] = useState();
  const id = useRef("cytoscape-id");

  useEffect(() => {
    if (!cy) {
      let container = null;
      try {
        container = document.getElementById(id) || undefined;
      } catch (e) {
        // Might be running Headless (the unit test are headless)
        container = undefined;
      }
      const newCy = cytoscape({
        ...options,
        container,
      });
      setCy(newCy);
      // If a callback was supplied we can now return the value
      if (getCy) {
        getCy(newCy);
      }
    }
  }, [cy, getCy, id, options]);

  return <div id={id} className="simple-react-cytoscape" />;
}
