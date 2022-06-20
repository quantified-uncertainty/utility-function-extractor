// EXPORTS
import { run } from "@quri/squiggle-lang";

export async function aggregatePathsThroughMixtureOfDistributions({
  pathsArray,
  orderedList,
  VERBOSE,
}) {
  let print = (x) => {
    if (VERBOSE) {
      console.log(x);
    }
  };
  let result = pathsArray.map((paths, i) => {
    print(orderedList[i].name);
    let multipliedDistributions = paths.map(
      (path) => path.multipliedDistributionsInPath
    );
    console.group();
    print("Number of paths: ", multipliedDistributions.length);
    let squiggleCode = `aggregatePath = mx(${multipliedDistributions
      .filter((distributions) => distributions != undefined)
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
      name: orderedList[i].name,
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
  let result = Math.exp(logavg / n);
  return result;
};

export function aggregatePathsThroughMixtureOfMeans({
  pathsArray,
  orderedList,
  VERBOSE,
  DONT_EXCLUDE_INFINITIES_AND_NANS,
}) {
  let print = (x) => {
    if (VERBOSE) {
      console.log(x);
    }
  };

  let result = pathsArray.map((paths, i) => {
    print(orderedList[i].name);
    let expectedRelativeValues = paths.map(
      (path) => path.expectedRelativeValue
    );

    let expectedRelativeValuesFiltered = expectedRelativeValues;

    if (!DONT_EXCLUDE_INFINITIES_AND_NANS) {
      expectedRelativeValuesFiltered = expectedRelativeValues
        .filter((x) => x != undefined)
        .filter((x) => !isNaN(x))
        .filter((x) => isFinite(x))
        .filter((x) => x != null);
    }

    let hasPositive = expectedRelativeValuesFiltered.filter((x) => x > 0);
    let hasNegative = expectedRelativeValuesFiltered.filter((x) => x < 0);
    let answer;
    if (hasPositive.length != 0 && hasNegative.length != 0) {
      answer = avg(expectedRelativeValuesFiltered);
    } else {
      if (hasNegative.length == 0) {
        answer = geomMean(expectedRelativeValuesFiltered);
      } else {
        let arrayAsPositive = expectedRelativeValuesFiltered.map((x) => -x);
        answer = -geomMean(arrayAsPositive);
      }
    }
    return {
      name: orderedList[i].name,
      aggregatedMeans: answer,
      arrayMeans: expectedRelativeValuesFiltered,
      allPositive: hasNegative.length == 0,
    };
  });
  return result;
}

export async function aggregatePaths({
  pathsArray,
  orderedList,
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
      orderedList,
      VERBOSE,
    });
  } else if (aggregationType == "mean") {
    return aggregatePathsThroughMixtureOfMeans({
      pathsArray,
      orderedList,
      VERBOSE,
    });
  } else {
    return aggregatePathsThroughMixtureOfMeans({
      pathsArray,
      orderedList,
      VERBOSE,
    });
  }
}
