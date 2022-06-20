import { run } from "@quri/squiggle-lang";

export async function resolveToNumIfPossible(comparisonString) {
  if (!isNaN(comparisonString) && comparisonString != "") {
    let response = {
      asNum: true,
      num: Number(comparisonString),
    };
    return response;
  }
  let squiggleMeanCommand = `mean(${comparisonString})`;
  let squiggleResponse = await run(squiggleMeanCommand);
  console.log(squiggleResponse);
  if (squiggleResponse.tag == "Ok") {
    let responseAsNumber = squiggleResponse.value.value;
    let response = {
      asNum: true,
      num: Number(responseAsNumber),
    };
    return response;
  } else {
    let errorMsg = squiggleResponse.value;
    let response = {
      asNum: false,
      errorMsg: errorMsg,
    };
    return response;
  }
}

export async function getSquiggleSparkline(comparisonString) {
  if (!isNaN(comparisonString) && comparisonString != "") {
    let response = {
      success: true,
      sparkline: comparisonString,
    };
    return response;
  }
  let squiggleSparklineCommand = `sparkline(${comparisonString}, 20)`;
  let squiggleResponse = await run(squiggleSparklineCommand);
  console.log(squiggleResponse);
  if (squiggleResponse.tag == "Ok") {
    let responseAsNumber = squiggleResponse.value.value;
    let response = {
      success: true,
      sparkline: responseAsNumber,
    };
    return response;
  } else {
    let errorMsg = squiggleResponse.value;
    let response = {
      success: false,
      errorMsg: errorMsg,
    };
    return response;
  }
}
