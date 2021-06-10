import Head from 'next/head'
import React, { useState } from "react";
import fs from 'fs';
import path from 'path';
import {DrawGraph} from '../lib/labeledgraph';
import { SliderElement } from "../lib/slider";
import {DisplayElement} from '../lib/displayElement'
import {DisplayAsMarkdown} from '../lib/displayAsMarkdown'
import {CreateTableWithDistances} from '../lib/findPaths'

// Utilities

let increasingList = (n) => Array.from(Array(n).keys())
let buildLinks = quantitativeComparisons => quantitativeComparisons.map(([element1, element2, distance]) => ({source: element1, target: element2, distance: distance}))

Array.prototype.containsArray = function(val) {
  var hash = {};
  for(var i=0; i<this.length; i++) {
      hash[this[i]] = i;
  }
  return hash.hasOwnProperty(val);
}

let checkIfListIsOrdered = (arr, binaryComparisons) => { 
  let l = arr.length
  let isOrdered = true
  for(let i=0; i<l-1; i++){
    isOrdered = isOrdered && binaryComparisons.containsArray([arr[i], arr[i+1]])
  }
  return isOrdered
}

let simplifySliderValue = value => 10**value >= 3 ? Math.round(10**value) : Math.round(10*10**value)/10

let displayFunctionSlider = (value) => {
  let result
  if(value >= 0){
    result = simplifySliderValue(value)
  }else{
    let inverseresult = simplifySliderValue(-value)
    result = `1/${inverseresult}`
  }
  result = `The first option is ${result}x as valuable as the second one`
  return result

};

let nicelyFormatLinks = (quantitativeComparisons , list) => quantitativeComparisons.map(([element1, element2, distance]) => ({source: list.indexOf(element1), target: list.indexOf(element2), distance: distance}))

/* React components */
// fs can only be used here. 
export async function getStaticProps() {
  //getServerSideProps
  // const { metaforecasts } = await getForecasts();
  const directory = path.join(process.cwd(),"pages")
  let listOfPosts = JSON.parse(fs.readFileSync(path.join(directory, 'listOfPosts.json'), 'utf8'));
  //console.log(directory)
  //console.log("metaforecasts", metaforecasts)
  return {
    props: {
      listOfPosts,
    },
  };
}

// Main react component
export default function Home({listOfPosts}) {
  // State
  let list = increasingList(listOfPosts.length) // [0,1,2,3,4]
  listOfPosts = listOfPosts.map((element, i) => ({...element, id: i}))

  const [toComparePair, setToComparePair] = useState([list[list.length-2], list[list.length-1]])
  const [sliderValue, setSliderValue] = useState(0)

  const [binaryComparisons, setBinaryComparisons] = useState([])
  const [quantitativeComparisons, setQuantitativeComparisons] = useState([]) // More expressive, but more laborious to search through. For the ordering step, I only manipulate the binaryComparisons.

  const [isListOrdered, setIsListOrdered]  = useState(false)
  const [orderedList, setOrderedList] = useState([])

  // Manipulations
  let compareTwoElements = (newBinaryComparisons, element1, element2) => {
    let element1Greater = newBinaryComparisons.containsArray([element1, element2])
    let element2Greater = newBinaryComparisons.containsArray([element2, element1])
    if(element1Greater || element2Greater){
      return element1Greater && !element2Greater
    } else{
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
      if(comparison ==  "No comparison found"){
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
  
  function mergeSort(arr, newBinaryComparisons) {
    if(arr ==  "No comparison found; unable to proceed"){
      return  "No comparison found; unable to proceed"
    }
    const half = arr.length / 2;
  
    // the base case is array length <=1
    if (arr.length <= 1) {
      return arr;
    }
  
    const left = arr.splice(0, half); // the first half of the array
    const right = arr;
    let orderedFirstHalf = mergeSort(left, newBinaryComparisons)
    let orderedSecondHalf = mergeSort(right, newBinaryComparisons)
    if(orderedFirstHalf != "No comparison found; unable to proceed" && orderedSecondHalf != "No comparison found; unable to proceed"){
      let result = merge(newBinaryComparisons, orderedFirstHalf, orderedSecondHalf);
      return result
    }else{
      return  "No comparison found; unable to proceed"
    }

  }

  let nextStepSimple = (binaryComparisons, element1, element2) => {
    //console.log("Binary comparisons: ")
    //console.log(JSON.stringify(binaryComparisons, null, 4));

    let newComparison = [element1, element2] // [element1, element2]
    let newBinaryComparisons = [...binaryComparisons, newComparison]
    //console.log("New binaryComparisons: ")
    //console.log(JSON.stringify(newBinaryComparisons, null, 4));
    setBinaryComparisons(newBinaryComparisons)  
    
    let result = mergeSort(list, newBinaryComparisons)
    //console.log(result)
    if(result !=  "No comparison found; unable to proceed" && checkIfListIsOrdered(result, newBinaryComparisons)){
      //console.log(result)
      setIsListOrdered(true)
      setOrderedList(result)
    }
  }

  let nextStepSlider = (binaryComparisons, sliderValue, element1, element2) => {
    if(sliderValue < 0){
      sliderValue = -sliderValue;
      [element1,element2] = [element2,element1]
    }

    nextStepSimple(binaryComparisons, element1, element2)

    let newQuantitativeComparison = [element1, element2, simplifySliderValue(sliderValue)]
    let newQuantitativeComparisons = [...quantitativeComparisons, newQuantitativeComparison]
    setQuantitativeComparisons(newQuantitativeComparisons)

    setSliderValue(0)
  }

  // Html
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 mt-10">
      <Head>
        <title>Utility Function Extractor</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
         Utility Function Extractor
        </h1>

        <div className = {`${isListOrdered ? "hidden" : ""}`}>
          <div className="flex flex-wrap items-center max-w-4xl mt-6 sm:w-full mt-20">
              <div 
                className="flex m-auto border-gray-300 border-4 h-72 w-72"
                //onClick={() => nextStep(binaryComparisons, toComparePair[0], toComparePair[1])}
              >
                <div className="block m-auto text-center">  
                  <DisplayElement element={listOfPosts[toComparePair[0]]}>
                  </DisplayElement>
                </div>
              </div>
              <div 
                className="flex m-auto border-gray-300 border-4 h-72 w-72 p-5"
                //onClick={() => nextStep(binaryComparisons, toComparePair[1], toComparePair[0])}
              >
                <div className="block m-auto text-center">  
                  <DisplayElement element={listOfPosts[toComparePair[1]]}>
                  </DisplayElement>
                </div>
              </div>
          </div>
          <div className={`flex row-start-3 row-end-3  col-start-1 col-end-4 md:col-start-3 md:col-end-3 md:row-start-1 md:row-end-1 lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-1 items-center justify-center mb-4 mt-10 ${isListOrdered? "hidden" : ""}`}>
            <SliderElement
                  className="flex items-center justify-center"
                  onChange={(event) => (setSliderValue(event[0]))}
                  value={sliderValue}
                  displayFunction={displayFunctionSlider}
                />
          </div>
          <button 
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mt-5"
            onClick={() => nextStepSlider(binaryComparisons, sliderValue, toComparePair[1], toComparePair[0])}>
              Submit
          </button>
        </div>
        
        <DrawGraph 
          isListOrdered={isListOrdered}
          nodes={orderedList.map(i => listOfPosts[i])}
          links={buildLinks(quantitativeComparisons)}>
        </DrawGraph>
          <div className={`inline items-center text-center mt-10 ${isListOrdered? "": "hidden" }`}>
            <CreateTableWithDistances
              isListOrdered={isListOrdered}
              nodes={orderedList.map(i => listOfPosts[i])}
              links={buildLinks(quantitativeComparisons)}
            >
            </CreateTableWithDistances>
        </div>
        
      </main>

      <div className={`inline text-left w-full flex-1 px-20 ${isListOrdered? "": "hidden" }`}>
          <DisplayAsMarkdown markdowntext={"## Ordered list\n\n" + JSON.stringify(orderedList.map(i => listOfPosts[i]), null, 4)}></DisplayAsMarkdown>
          <DisplayAsMarkdown markdowntext={"## Distances\n\n" + JSON.stringify(nicelyFormatLinks(quantitativeComparisons, list), null, 4)}></DisplayAsMarkdown>
          {/*
                    <p>{`Binary comparisons: ${JSON.stringify(binaryComparisons, null, 4)}`}</p> 
          <p>{`Quantitative comparisons: ${JSON.stringify(quantitativeComparisons, null, 4)}`}</p> 

          */}
      </div>
    </div>
  )
}
