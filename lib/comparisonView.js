/* Imports */
import Head from 'next/head'
import React, { useState } from "react";
import { DrawGraph, removeOldSvg } from './labeledGraph';
import { SubmitSliderButton } from "./slider";
import { DisplayElement } from './displayElement'
import { DisplayAsMarkdown } from './displayAsMarkdown'
import { CreateTable, buildRows } from './findPaths'
import { DataSetChanger } from "./datasetChanger"
import { ComparisonsChanger } from "./comparisonsChanger"
import { pushToMongo } from "./pushToMongo.js"
import { increasingList, maxMergeSortSteps, expectedNumMergeSortSteps } from "./utils.js"

/* DEFINTIONS */
const DEFAULT_COMPARE = () => 1 // 1/Math.random() - 1

/* Misc. helpers */
let buildLinks = quantitativeComparisons => quantitativeComparisons.map(([element1, element2, distance, reasoning]) => ({ source: element1, target: element2, distance: distance, reasoning: reasoning }))

Array.prototype.containsArray = function (val) {
  var hash = {};
  for (var i = 0; i < this.length; i++) {
    hash[this[i]] = i;
  }
  return hash.hasOwnProperty(val);
}

let checkIfListIsOrdered = (arr, binaryComparisons) => {
  let l = arr.length
  let isOrdered = true
  for (let i = 0; i < l - 1; i++) {
    isOrdered = isOrdered && binaryComparisons.containsArray([arr[i], arr[i + 1]])
  }
  return isOrdered
}

let nicelyFormatLinks = (quantitativeComparisons, listOfElements) => quantitativeComparisons.map(([element1, element2, distance, reasoning]) => ({ source: listOfElements[element1].name, target: listOfElements[element2].name, distance: distance, reasoning: reasoning }))

// Main react component
export default function ComparisonView({ listOfElementsForView }) {

  /* State */
  // initial state values
  let initialListOfElements = listOfElementsForView.map((element, i) => ({ ...element, id: i }))
  let initialPosList = increasingList(listOfElementsForView.length) // [0,1,2,3,4]
  let initialComparePair = [initialPosList[initialPosList.length - 2], initialPosList[initialPosList.length - 1]]
  let initialSliderValue = 1
  let initialReasoning = ''
  let initialBinaryComparisons = []
  let initialQuantitativeComparisons = []
  let initialIsListOdered = false
  let initialOrderedList = []
  let initialShowAdvancedOptions = false
  let initialShowComparisons = false
  let initialShowLoadComparisons = false
  let initialShowChangeDataSet = false
  let initialNumSteps = 0;
  let initialMaxSteps = maxMergeSortSteps(listOfElementsForView.length)
  let initialExpectedSteps = expectedNumMergeSortSteps(listOfElementsForView.length)
  let initialTableRows = []
  let initialDontPushSubmitButtonAnyMore = false

  // state variables and functions
  const [listOfElements, setListOfElements] = useState(initialListOfElements)
  const [posList, setPosList] = useState(initialPosList)
  const [toComparePair, setToComparePair] = useState(initialComparePair)
  const [sliderValue, setSliderValue] = useState(initialSliderValue)
  const [reasoning, setReasoning] = useState(initialReasoning)
  const [binaryComparisons, setBinaryComparisons] = useState(initialBinaryComparisons)
  const [quantitativeComparisons, setQuantitativeComparisons] = useState(initialQuantitativeComparisons) // More expressive, but more laborious to search through. For the ordering step, I only manipulate the binaryComparisons.

  const [isListOrdered, setIsListOrdered] = useState(initialIsListOdered)
  const [orderedList, setOrderedList] = useState(initialOrderedList)
  const [dontPushSubmitButtonAnyMore, setDontPushSubmitButtonAnyMore] = useState(initialDontPushSubmitButtonAnyMore)

  let [showAdvancedOptions, changeShowAdvanceOptions] = useState(initialShowAdvancedOptions);
  let [showComparisons, changeShowComparisons] = useState(initialShowComparisons);
  let [showLoadComparisons, changeShowLoadComparisons] = useState(initialShowLoadComparisons);
  let [showChangeDataSet, changeshowChangeDataSet] = useState(initialShowChangeDataSet);
  let [numSteps, changeNumSteps] = useState(initialNumSteps);
  let [maxSteps, changeMaxSteps] = useState(initialMaxSteps)
  let [expectedSteps, changeExpectedSteps] = useState(initialExpectedSteps)
  let [tableRows, setTableRows] = useState(initialTableRows)

  /* Convenience utils: restart + changeDataSet */
  let restart = (posList) => {//({posList, initialBinaryComparisons2, initialQuantitativeComparisons2}) => {
    setToComparePair([posList[posList.length - 2], posList[posList.length - 1]])
    setSliderValue(initialSliderValue)
    setBinaryComparisons(initialBinaryComparisons2 || initialBinaryComparisons)
    setQuantitativeComparisons(initialQuantitativeComparisons2 || initialQuantitativeComparisons)
    setIsListOrdered(initialIsListOdered)
    setOrderedList(initialOrderedList)
    changeNumSteps(initialNumSteps)
    removeOldSvg()
    setTableRows(initialTableRows)
    setDontPushSubmitButtonAnyMore(initialDontPushSubmitButtonAnyMore)
  }

  let changeDataSet = (listOfElementsNew) => {
    listOfElementsNew =
      listOfElementsNew.map((element, i) => ({ ...element, id: i }))
    let newPosList = increasingList(listOfElementsNew.length)
    let newListLength = listOfElementsNew.length

    setListOfElements(listOfElementsNew)
    setPosList(increasingList(listOfElementsNew.length))
    setToComparePair([newPosList[newPosList.length - 2], newPosList[newPosList.length - 1]])

    changeExpectedSteps(expectedNumMergeSortSteps(newListLength))
    changeMaxSteps(maxMergeSortSteps(newListLength))

    restart(newPosList)
    // restart({posList: newPosList})
  }

  let changeComparisons = (links, listOfElements) => {
    let quantitativeComparisons2 = []
    let binaryComparisons2 = []
    for(let link of links){
      let {source, target, distance, reasoning} = link
      let searchByName = (name, candidate) => candidate.name == name
      let testForSource = (candidate) => searchByName(source, candidate)
      let testForTarget = (candidate) => searchByName(target, candidate)
      let element1 = listOfElements.findIndex(testForSource)
      let element2 = listOfElements.findIndex(testForTarget)
      if(element1 == -1 || element2 == -1){
        throw new Error("Comparisons include unknown elements, please retry")
      }
      quantitativeComparisons2.push([element1, element2, distance, reasoning])
      binaryComparisons2.push([element1,element2])
    }
    // return ({quantitativeComparisons: quantitativeComparisons2, binaryComparisons: binaryComparisons2})
    //restart({posList, initialBinaryComparisons2=initialBinaryComparisons, initialQuantitativeComparisons2=initialQuantitativeComparisons})
    restart(posList)
  }

  // Manipulations
  let compareTwoElements = (newBinaryComparisons, element1, element2) => {
    let element1Greater = newBinaryComparisons.containsArray([element1, element2])
    let element2Greater = newBinaryComparisons.containsArray([element2, element1])
    if (element1Greater || element2Greater) {
      return element1Greater && !element2Greater
    } else {
      setToComparePair([element1, element2])
      //console.log(`No comparison found between ${element1} and ${element2}`)
      //console.log(`Comparisons:`)
      //console.log(JSON.stringify(newBinaryComparisons, null, 4));
      return "No comparison found"
    }
  }

  function merge(newBinaryComparisons, left, right) {
    let sortedArr = []; // the sorted elements will go here

    while (left.length && right.length) {
      // insert the biggest element to the sortedArr
      let comparison = compareTwoElements(newBinaryComparisons, left[0], right[0])
      if (comparison == "No comparison found") {
        return "No comparison found; unable to proceed"
      }
      else if (comparison) { // left[0] > right[0]
        sortedArr.push(left.shift());
      } else {
        sortedArr.push(right.shift());
      }
    }

    // use spread operator and create a new array, combining the three arrays
    return [...sortedArr, ...left, ...right]; // if they don't have the same size, the remaining ones will be greater than the ones before
  }

  function mergeSort({ array, comparisons }) {
    if (array == "No comparison found; unable to proceed") {
      return "No comparison found; unable to proceed"
    }
    const half = array.length / 2;

    // the base case is array length <=1
    if (array.length <= 1) {
      return array;
    }

    const left = array.slice(0, half); // the first half of the array
    const right = array.slice(half, array.length) // Note that splice is destructive. 
    let orderedFirstHalf = mergeSort({ array: left, comparisons })
    let orderedSecondHalf = mergeSort({ array: right, comparisons })
    if (orderedFirstHalf != "No comparison found; unable to proceed" && orderedSecondHalf != "No comparison found; unable to proceed") {
      let result = merge(comparisons, orderedFirstHalf, orderedSecondHalf);
      return result
    } else {
      return "No comparison found; unable to proceed"
    }

  }

  let nextStepSimple = (posList, binaryComparisons, element1, element2) => {
    //console.log("Binary comparisons: ")
    //console.log(JSON.stringify(binaryComparisons, null, 4));

    let newComparison = [element1, element2] // [element1, element2]
    let newBinaryComparisons = [...binaryComparisons, newComparison]
    //console.log("New binaryComparisons: ")
    //console.log(JSON.stringify(newBinaryComparisons, null, 4));
    setBinaryComparisons(newBinaryComparisons)

    let result = mergeSort({ array: posList, comparisons: newBinaryComparisons })
    //console.log(result)
    if (result != "No comparison found; unable to proceed" && checkIfListIsOrdered(result, newBinaryComparisons)) {
      // console.log(`isListOrdered: ${isListOrdered}`)
      console.log("poslist@nextStepSimple")
      console.log(posList)
      console.log("result@nextStepSimple")
      console.log(result)

      return [true, result]
    } else {
      return [false, result]
    }
  }

  let nextStepSlider = async ({ posList, binaryComparisons, sliderValue, reasoning, element1, element2 }) => {
    if (!dontPushSubmitButtonAnyMore) {
      if (sliderValue < 1 && sliderValue > 0) {
        sliderValue = 1 / sliderValue;
        [element1, element2] = [element2, element1]
      }
      console.log(`posList@nextStepSlider:`)
      console.log(posList)
      let [successStatus, result] = nextStepSimple(posList, binaryComparisons, element1, element2)

      let newQuantitativeComparison = [element1, element2, sliderValue, reasoning]
      let newQuantitativeComparisons = [...quantitativeComparisons, newQuantitativeComparison]
      setQuantitativeComparisons(newQuantitativeComparisons)

      setSliderValue(DEFAULT_COMPARE())
      setReasoning('')
      changeNumSteps(numSteps + 1)
      if (successStatus) {
        setDontPushSubmitButtonAnyMore(true)

        let jsObject = nicelyFormatLinks(quantitativeComparisons, listOfElements)
        await pushToMongo(jsObject)
        console.log(jsObject)

        alert("Comparisons completed. Background work might take a while, or straight-out fail")
        setIsListOrdered(true)
        setOrderedList(result)

        await buildRows({
          isListOrdered: true,
          orderedList: result,
          listOfElements,
          links: buildLinks(newQuantitativeComparisons),
          rows: tableRows,
          setTableRows
        })
        /*
        setTimeout(async () => {
          // Make sure to do this after the 

        }, 100);
        */
      }
    }

  }

  // Html
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">

      {/* Webpage name & favicon */}
      <div className="mt-20">
        <Head >
          <title>Utility Function Extractor</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
      </div>
      <main className="flex flex-col items-center w-full flex-1 px-20 text-center">

        {/* Heading */}
        <h1 className="text-6xl font-bold">
          Utility Function Extractor
        </h1>
        {/* Approximate progress indicator */}

        <p>{`${numSteps} out of ~${expectedSteps} (max ${maxSteps}) comparisons`}</p>

        {/* Comparison section */}
        <div className={isListOrdered ? "hidden" : ""}>
          <div className="flex flex-wrap items-center max-w-4xl sm:w-full mt-10">

            {/* Element 1 */}
            <div className="flex m-auto border-gray-300 border-4 h-72 w-72 p-5">
              <div className="block m-auto text-center">
                <DisplayElement element={listOfElements[toComparePair[0]]}>
                </DisplayElement>
              </div>
            </div>

            {/* Comparison actuator (text, previously slider) */}
            <div className="flex m-auto w-72">
              <div className="block m-auto text-center">
                <br />
                <label>
                  {`... is `}
                  <br />
                  <input
                    type="number"
                    className="text-center text-blueGray-600 bg-white rounded text-lg border-0 shadow outline-none focus:outline-none focus:ring w-8/12 h-10 m-2"
                    value={sliderValue}
                    onChange={(event) => {
                      //console.log(event)
                      //console.log(event.target.value)
                      setSliderValue(event.target.value)
                    }}
                  />
                  <br />
                  {`times as valuable as ...`}
                </label>
                <br />

                <SubmitSliderButton
                  posList={posList}
                  binaryComparisons={binaryComparisons}
                  sliderValue={sliderValue}
                  reasoning={reasoning}
                  toComparePair={toComparePair}
                  nextStepSlider={nextStepSlider}
                  dontPushSubmitButtonAnyMore={dontPushSubmitButtonAnyMore}
                />
              </div>
            </div>

            {/* Element 2 */}
            <div className="flex m-auto border-gray-300 border-4 h-72 w-72 p-5">
              <div className="block m-auto text-center">
                <DisplayElement element={listOfElements[toComparePair[1]]}>
                </DisplayElement>
              </div>
            </div>
          </div>
          <br />

          <label className="">
            Reasoning (optional):
            <textarea className="mt-2 px-3 py-4 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-base border-0 shadow outline-none focus:outline-none focus:ring w-full"
              value={reasoning}
              onChange={(event) => setReasoning(event.target.value)}
            />
          </label>
          <br />
          <div>
          </div>
          {/* Old slider element (previous actuator)

          <div className={`flex row-start-3 row-end-3  col-start-1 col-end-4 md:col-start-3 md:col-end-3 md:row-start-1 md:row-end-1 lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-1 items-center justify-center mb-4 mt-10 ${isListOrdered ? "hidden" : ""}`}>
            <SliderElement
              className="flex items-center justify-center"
              onChange={(event) => (setSliderValue(event[0]))}
              value={sliderValue}
              displayFunction={displayFunctionSlider}
              domain={domain}
            />
          </div>
          */}
        </div>

        {/* Results section */}
        <div>
          {/* Graph */}
          <DrawGraph
            isListOrdered={isListOrdered}
            orderedList={orderedList}
            listOfElements={listOfElements}
            links={buildLinks(quantitativeComparisons)}>
          </DrawGraph>

          {/* Comparison table */}
          <div className={isListOrdered ? "inline items-center text-center mt-10" : "hidden"}>
            <CreateTable
              isListOrdered={isListOrdered}
              orderedList={orderedList}
              listOfElements={listOfElements}
              links={buildLinks(quantitativeComparisons)}
              tableRows={tableRows}
              setTableRows={setTableRows}
            >
            </CreateTable>
          </div>
        </div>

        {/* Convenience functions */}
        <div className="w-2/12 flex justify-center mt-10">
          <button
            className="text-gray-500 text-sm"
            onClick={() => changeShowAdvanceOptions(!showAdvancedOptions)}
          >
            Advanced options ▼
          </button>
        </div>

        <div className={showAdvancedOptions ? "flex flex-wrap -mx-4 overflow-hidden" : "hidden"}>
          {/* Button: Restart */}
          <div className="my-4 px-4 w-1/4 overflow-hidden">
            <button
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mt-5"
              onClick={() => restart(posList)}>
              {/* onClick={() => restart({posList})}> */}
              Restart
            </button>
          </div>
          {/* Button: Show comparisons */}
          <div className="my-4 px-4 w-1/4 overflow-hidden">
            <button
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mt-5"
              onClick={() => changeShowComparisons(!showComparisons)}>
              Show comparisons
            </button>
          </div>
          {/* Button: Load comparisons */}
          <div className="my-4 px-4 w-1/4 overflow-hidden">
            <button
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mt-5"
              onClick={() => changeShowLoadComparisons(!showLoadComparisons)}>
              Load comparisons
            </button>
          </div>
          {/* Button: Change dataset */}
          <div className="my-4 px-4 w-1/4 overflow-hidden">
            <button
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mt-5"
              onClick={() => changeshowChangeDataSet(!showChangeDataSet)}>
              Use your own data
            </button>
          </div>
        </div>
        {/* Change dataset section */}
        <div className={showChangeDataSet ? "inline mt-5" : "hidden"}>
          <DataSetChanger handleSubmit={changeDataSet} />
        </div>

        {/* Show comparisons section */}
        <div className={showComparisons ? "inline mt-5" : "hidden"}>
          <h2>Comparisons</h2>
          <div className="text-left">
            <DisplayAsMarkdown
              markdowntext={JSON.stringify(nicelyFormatLinks(quantitativeComparisons, listOfElements), null, 4)}
              className={""}>
            </DisplayAsMarkdown>
          </div>
        </div>
        {/* Load comparisons section */}
        <div className={showLoadComparisons ? "inline mt-5" : "hidden"}>
          <ComparisonsChanger handleSubmit={changeComparisons} />
          {/*<ComparisonsChanger handleSubmit={changeComparisons} />*/}
        </div>
      </main>

    </div>
  )
}
