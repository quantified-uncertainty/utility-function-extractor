// EXPORTS
import { run } from "@quri/squiggle-lang";

export function aggregatePaths(pathsArray, nodes) {
  pathsArray.map((paths, i) => {
    console.log(nodes[i].name);
    let multipliedDistributions = paths.map(
      (path) => path.multipliedDistributionsInPath
    );
    console.group();
    console.log("Number of paths: ", multipliedDistributions.length);
    // console.log(multipliedDistributions.slice(0, 10));
    let squiggleCode = `aggregatePath = mx(${multipliedDistributions
      .filter((distributions) => distributions != undefined)
      // .slice(0, 600)
      .join(", ")})`;

    // Start measuring time
    let start = Date.now();

    // Get the mean
    let squiggleCodeForMean = squiggleCode + "\n" + "mean(aggregatePath)";
    let meanAnswer = run(squiggleCodeForMean);
    let mean = meanAnswer.value.value;
    console.log(`Mean: ${mean}`);

    // Get the 90% CI
    let squiggleCodeFor90CI =
      squiggleCode +
      "\n" +
      "[inv(aggregatePath, 0.05), inv(aggregatePath, 0.95)]";
    let ci90percentAnswer = run(squiggleCodeFor90CI);

    // Display output
    let processCI90 = (answer) => {
      let value = answer.value.value;
      let lower = value[0].value;
      let upper = value[1].value;
      return [lower, upper];
    };
    console.log(
      `90% confidence interval: ${JSON.stringify(
        processCI90(ci90percentAnswer),
        null,
        4
      )}`
    );
    // Stop measuring time
    let end = Date.now();
    console.log(`${(end - start) / 1000} seconds needed for processing`);
    console.groupEnd();
    console.log("");
  });
}
