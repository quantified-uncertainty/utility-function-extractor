// EXPORTS
import { run } from "@quri/squiggle-lang";

export async function aggregatePathsThroughMixtureOfDistributions({
  pathsArray,
  nodes,
  VERBOSE,
}) {
  let print = (x) => {
    if (VERBOSE) {
      console.log(x);
    }
  };
  let result = pathsArray.map((paths, i) => {
    print(nodes[i].name);
    let multipliedDistributions = paths.map(
      (path) => path.multipliedDistributionsInPath
    );
    console.group();
    print("Number of paths: ", multipliedDistributions.length);
    // print(multipliedDistributions.slice(0, 10));
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
    print(`Mean: ${mean}`);

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
    print(
      `90% confidence interval: ${JSON.stringify(
        processCI90(ci90percentAnswer),
        null,
        4
      )}`
    );
    // Stop measuring time
    let end = Date.now();
    print(`${(end - start) / 1000} seconds needed for processing`);
    console.groupEnd();
    print("");
    return {
      name: nodes[i].name,
      meanOfAggregatedDistributions: mean,
      ninetyPercentileConfidenceIntervalOfAggregatedDistributions:
        ci90percentAnswer,
      arrayDistributions: squiggleCode,
    };
  });
  return result;
}

const sum = (arr) => arr.reduce((a, b) => a + b, 0);

export const avg = (arr) => sum(arr) / arr.length;

export const geomMean = (arr) => {
  let n = arr.length;
  let logavg = sum(arr.map((x) => Math.log(x))); // works for low numbers much better
  // console.log(logavg);
  let result = Math.exp(logavg / n);
  return result;
};

export function aggregatePathsThroughMixtureOfMeans({
  pathsArray,
  nodes,
  VERBOSE,
}) {
  let print = (x) => {
    if (VERBOSE) {
      console.log(x);
    }
  };

  let result = pathsArray.map((paths, i) => {
    print(nodes[i].name);
    let expectedRelativeValues = paths
      .map((path) => path.expectedRelativeValue)
      .filter((x) => x != undefined);
    let hasPositive = expectedRelativeValues.filter((x) => x > 0);
    let hasNegative = expectedRelativeValues.filter((x) => x < 0);
    let answer;
    if (hasPositive.length != 0 && hasNegative.length != 0) {
      answer = avg(expectedRelativeValues);
    } else {
      if (hasNegative.length == 0) {
        answer = geomMean(expectedRelativeValues);
      } else {
        let arrayAsPositive = expectedRelativeValues.map((x) => -x);
        answer = -geomMean(arrayAsPositive);
      }
    }
    return {
      name: nodes[i].name,
      aggregatedMeans: answer,
      arrayMeans: expectedRelativeValues,
      allPositive: hasNegative.length == 0,
    };
  });
  return result;
}

export async function aggregatePaths({
  pathsArray,
  nodes,
  aggregationType,
  VERBOSE,
}) {
  if (aggregationType == "distribution") {
    if (VERBOSE == undefined) {
      VERBOSE = true;
    }
    console.log("Warning: this may take a long time");
    return await aggregatePathsThroughMixtureOfDistributions({
      pathsArray,
      nodes,
      VERBOSE,
    });
  } else if (aggregationType == "mean") {
    return aggregatePathsThroughMixtureOfMeans({
      pathsArray,
      nodes,
      VERBOSE,
    });
  } else {
    return aggregatePathsThroughMixtureOfMeans({
      pathsArray,
      nodes,
      VERBOSE,
    });
  }
}
