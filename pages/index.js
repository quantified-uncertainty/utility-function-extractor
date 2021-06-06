import Head from 'next/head'
import React, { useState } from "react";

// Utilities
Array.prototype.containsArray = function(val) {
  var hash = {};
  for(var i=0; i<this.length; i++) {
      hash[this[i]] = i;
  }
  return hash.hasOwnProperty(val);
}

let checkIfListIsOrdered = (arr, comparisons) => {
  let l = arr.length
  let isOrdered = true
  for(let i=0; i<l-1; i++){
    isOrdered = isOrdered && comparisons.containsArray([arr[i], arr[i+1]])
  }
  return isOrdered
}

// Main
export default function Home() {
  // State
  let list = [1,2,3,4,5,6,7,8,9,10]
  let initialComparisonPair = [9,10]
  const [toComparePair, setToComparePair] = useState(initialComparisonPair)
  const [comparisons, updateComparisons] = useState([])
  const [isListOrdered, setIsListOrdered]  = useState(false)
  const [orderedList, setOrderedList] = useState(null)

  // Manipulations
  let compareTwoElements = (newComparisons, element1, element2) => {
    let element1Greater = newComparisons.containsArray([element1, element2])
    let element2Greater = newComparisons.containsArray([element2, element1])
    if(element1Greater || element2Greater){
      return element1Greater && !element2Greater
    } else{
      setToComparePair([element1, element2])
      console.log(`No comparison found between ${element1} and ${element2}`)
      console.log(`Comparisons:`)
      console.log(JSON.stringify(newComparisons, null, 4));
      return "No comparison found"
    }
  }

  function merge(newComparisons, left, right) {
    let sortedArr = []; // the sorted elements will go here
  
    while (left.length && right.length) {
      // insert the biggest element to the sortedArr
      let comparison = compareTwoElements(newComparisons, left[0], right[0])
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
  
  function mergeSort(arr, newComparisons) {
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
    let orderedFirstHalf = mergeSort(left, newComparisons)
    let orderedSecondHalf = mergeSort(right, newComparisons)
    if(orderedFirstHalf != "No comparison found; unable to proceed" && orderedSecondHalf != "No comparison found; unable to proceed"){
      let result = merge(newComparisons, orderedFirstHalf, orderedSecondHalf);
      return result
    }else{
      return  "No comparison found; unable to proceed"
    }

  }

  let nextStep = (comparisons, element1, element2) => {
    console.log("Comparisons: ")
    console.log(JSON.stringify(comparisons, null, 4));
    let newComparison = [element1, element2] // [element1, element2]
    let newComparisons = [...comparisons, newComparison]
    console.log("New comparisons: ")
    console.log(JSON.stringify(newComparisons, null, 4));
    updateComparisons(newComparisons)  
    let result = mergeSort(list, newComparisons)
    console.log(result)
    console.log(toComparePair)
    if(result !=  "No comparison found; unable to proceed" && checkIfListIsOrdered(result, newComparisons)){
      alert("Order complete")
      console.log(result)
      setIsListOrdered(true)
      setOrderedList(result)
    }
  }

  // Html
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Welcome to Hot Or Not</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Hot or not?
        </h1>

        <div className={`flex flex-wrap items-center max-w-4xl mt-6 sm:w-full mt-20 ${isListOrdered? "hidden" : ""}`}>
            <button 
              className="flex m-auto border-gray-300 border-4 h-64 w-64"
              onClick={() => nextStep(comparisons, toComparePair[0], toComparePair[1])}
            >
              <p className="block m-auto text-center">{toComparePair[0]}</p>
            </button>
            <button 
              className="flex m-auto border-gray-300 border-4 h-64 w-64"
              onClick={() => nextStep(comparisons, toComparePair[1], toComparePair[0])}
            >
              <p className="block m-auto text-center">{toComparePair[1]}</p>
            </button>
        </div>
        <div className={`mt-10 ${isListOrdered? "": "hidden" }`}>
          <p>{`Ordered list: ${JSON.stringify(orderedList, null, 4)}`}</p> 
          <p>{`Comparisons: ${JSON.stringify(comparisons, null, 4)}`}</p> 
        </div>
        
      </main>

    </div>
  )
}
