import React, { useState } from "react";

export function DataSetChanger({ onChangeOfDataset, show }) {
  let [value, setValue] = useState(`[
    {
      "name": "Some element. The name field is necessary",
      "url": "http://www.example.com",
      "somethirdfield": "a"
    },
    {
      "name": "Another element",
      "url": "http://www.example1.com",
      "somethirdfield": "b"
    },
    {
      "name": "A third element",
      "url": "http://www.example2.com",
      "isReferenceValue": true,
      "somethirdfield": "c"
    }
  ]`);
  const [displayingDoneMessage, setDisplayingDoneMessage] = useState(false);
  const [displayingDoneMessageTimer, setDisplayingDoneMessageTimer] =
    useState(null);

  let handleChange = (event) => {
    setValue(event.target.value);
  };

  let handleSubmitInner = (event) => {
    clearTimeout(displayingDoneMessageTimer);
    event.preventDefault();
    //console.log(event)
    console.log("value@handleSubmitInner@DataSetChanger");
    //console.log(typeof(value));
    console.log(value);
    try {
      let newData = JSON.parse(value);
      //console.log(typeof(newData))
      //console.log(newData)
      if (!newData.length || newData.length < 2) {
        throw Error("Not enough objects");
      }
      onChangeOfDataset(newData);
      setDisplayingDoneMessage(true);
      let timer = setTimeout(() => setDisplayingDoneMessage(false), 3000);
      setDisplayingDoneMessageTimer(timer);
    } catch (error) {
      setDisplayingDoneMessage(false);
      //alert(error)
      //console.log(error)
      let substituteText = `Error: ${error.message}

Try something like:
[
  {
    "name": "Some element. The name field is necessary",
    "url": "http://www.example.com",
    "somethirdfield": "a"
  },
  {
    "name": "Another element",
    "url": "http://www.example1.com",
    "somethirdfield": "b"
  },
  {
    "name": "Another element",
    "url": "http://www.example2.com",
    "isReferenceValue": true,
    "somethirdfield": "c"
  }
]

Your old input was: ${value}`;
      setValue(substituteText);
    }
  };
  return (
    <div className={`${show ? "" : "hidden"} `}>
      <form onSubmit={handleSubmitInner} className="inline mt-0">
        <h3 className="text-lg mt-8">Change dataset</h3>
        <textarea
          value={value}
          onChange={handleChange}
          rows="10"
          cols="50"
          className="mt-2"
        />
        <br />
        <button
          className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mt-5 p-10"
          onClick={handleSubmitInner}
        >
          Change dataset
        </button>
        &nbsp;
        <button
          className={
            displayingDoneMessage
              ? "bg-transparent text-blue-700 font-semibold py-2 px-4 border border-blue-500 rounded mt-5 p-10"
              : "hidden"
          }
        >
          Done!
        </button>
      </form>
    </div>
  );
}
