import React, { useState } from 'react';

export function ComparisonsChanger({handleSubmit}){
  // let defaultText=JSON.stringify(nicelyFormatLinks(quantitativeComparisons, listOfElements), null, 4)

  let [value, setValue] = useState(``)
  const [displayingDoneMessage, setDisplayingDoneMessage] = useState(false)
  const [displayingDoneMessageTimer, setDisplayingDoneMessageTimer] = useState(null)

  let handleChange = (event) => {
    setValue(event.target.value)
  }

  let handleSubmitInner = (event) => {
    clearTimeout(displayingDoneMessageTimer)
    event.preventDefault();
    //console.log(event)
    console.log("value@handleSubmitInner@ComparisonsChanger")
    //console.log(typeof(value));
    console.log(value);
    try{
      let newData = JSON.parse(value)
      //console.log(typeof(newData))
      //console.log(newData)
      handleSubmit(newData)
      /*
      if(!newData.length || newData.length < 2){
        throw Error("Not enough objects")
      }
      */
      setDisplayingDoneMessage(true)
      let timer = setTimeout(() => setDisplayingDoneMessage(false), 3000);
      setDisplayingDoneMessageTimer(timer)
    }catch(error){
      setDisplayingDoneMessage(false)
      //alert(error)
      //console.log(error)
      let substituteText = `Error: ${error.message}

Try something like:
[
  {
    "source": "x",
    "target": "y",
    "distance": 99999.99999999999,
    "reasoning": "blah blah"
  },
  {
    "source": "y",
    "target": "z",
    "distance": 1,
    "reasoning": "blah blah"
  },
  {
    "source": "x",
    "target": "z",
    "distance": 10,
    "reasoning": "blah blah"
  }
]

Your old input was: ${value}`
      setValue(substituteText)
    }
    
    
  }
  return (
    <form onSubmit={handleSubmitInner} className="inline">
      <br/>
      <br/>
      <textarea 
        value={value} 
        onChange={handleChange} 
        rows="10" cols="50"
        className=""
      />
      <br/>
      <button 
        className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mt-5 p-10"
        onClick={handleSubmitInner}>
        Change comparisons
      </button>
      &nbsp;
      <button
        className={displayingDoneMessage ? "bg-transparent text-blue-700 font-semibold py-2 px-4 border border-blue-500 rounded mt-5 p-10" : "hidden"}
      >
        Done!
      </button>
    </form>
  );
}