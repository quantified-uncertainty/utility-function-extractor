/* Imports*/
import React from "react";
import { toLocale, truncateValueForDisplay, numToAlphabeticalString, formatLargeOrSmall } from "../lib/utils.js"

/* Utilities */
let avg = arr => arr.reduce((a,b) => (a+b)) / arr.length

/* Main function */

function findPathsInner({sourceElementId, targetElementId, pathSoFar, links, nodes, maxLengthOfPath}){
    // THis has a tendency to produce too much recursion errors
    // could be refactored
    let paths = []

    if(maxLengthOfPath > 0){
        for(let link of links){
            if(
                ((link.source == sourceElementId) && (link.target == targetElementId)) || 
                ((link.source == targetElementId) && (link.target == sourceElementId))
            ){
                paths.push(pathSoFar.concat(link).flat())
            } else if((link.source == sourceElementId)){
                let newPaths = findPathsInner({sourceElementId:link.target, targetElementId, pathSoFar: pathSoFar.concat(link).flat(), links, nodes, maxLengthOfPath: (maxLengthOfPath-1)})
                if(newPaths.length != 0){
                    paths.push(...newPaths)
                }
            }else if((link.target == sourceElementId)){
                let newPaths = findPathsInner({sourceElementId:link.source, targetElementId, pathSoFar: pathSoFar.concat(link).flat(), links, nodes, maxLengthOfPath: (maxLengthOfPath-1)})
                if(newPaths.length != 0){
                    paths.push(...newPaths)
                }
            }
        }
    }
    
    return paths
}

function findPaths({sourceElementId, targetElementId, links, nodes}){
    let positionSourceElement = nodes.map((element, i) => (element.id)).indexOf(sourceElementId)
    let positionTargetElement = nodes.map((element, i) => (element.id)).indexOf(targetElementId)
    let maxLengthOfPath = Math.abs(positionSourceElement - positionTargetElement)
    
    let paths = []
    try{
        paths = findPathsInner({sourceElementId, targetElementId, pathSoFar: [], links, nodes, maxLengthOfPath})
    }catch(error){
        console.log("Error: probably too much recursion.")
    }
    return paths
}

function findDistance({sourceElementId, targetElementId, nodes, links}){
    let paths = findPaths({sourceElementId, targetElementId, nodes, links})
    console.log(targetElementId)
    console.log(paths)
    let weights = []
    for(let path of paths){
        let currentSource = sourceElementId
        let weight = 1
        for(let element of path){
            let distance = 0
            if(element.source == currentSource){
                distance = element.distance
                currentSource = element.target
            }else if(element.target == currentSource){
                distance = 1/Number(element.distance)
                currentSource = element.source
            }
            weight = weight*distance
            
        }
        weights.push(weight)
    }
    //let sum = JSON.stringify(weights)//weights.length > 0 ? weights.reduce((a,b) => (a+b)) / weights.length : "Not found"
    //return sum
    return weights
    //return weights.map(weight => Math.round(weight*100)/100)
}

function findDistancesForAllElements({nodes, links}){
    let referenceElements = nodes.filter(x => x.isReferenceValue)
    let midpoint = Math.round(nodes.length/2)
    let referenceElement = referenceElements.length > 0 ? referenceElements[0] : nodes[midpoint]
    // console.log(nodes)
    let distances = nodes.map(node =>
        node.isReferenceValue || (node.id == referenceElement.id) ? [1] : findDistance({sourceElementId: referenceElement.id, targetElementId: node.id, nodes, links})
    )
    return distances
}

function abridgeArrayAndDisplay(array){
    let newArray
    let formatForDisplay
    if(array.length > 10){
        newArray = array.slice(0,9)
        formatForDisplay= newArray.map(d => formatLargeOrSmall(d))
        formatForDisplay[9] = "..."
    }else{
        newArray=array
        formatForDisplay= newArray.map(d => formatLargeOrSmall(d))
    }
    let result = JSON.stringify(formatForDisplay, null, 2).replaceAll(`"`, "")
    return result
}

function CreateTableWithDistances({isListOrdered, orderedList, listOfElements, links}){
    // Not used anywhere because it's too resource intensive
    // The culprit is findPathsInner, a recursive function which
    // has a tendency to produce "Maximum call stack size exceeded"
    // or "too much recursion" errors
    if(!isListOrdered || orderedList.length < listOfElements.length){ 
        return (<div>{""}</div>)
    } else {
        let nodes = orderedList.map(i => listOfElements[i])
        let distances = findDistancesForAllElements({nodes, links})
        let rows = nodes.map((element, i) => ({id: numToAlphabeticalString(element.id), name: element.name, distances: distances[i]}))
        console.log("rows@CreateTableWithDistances")
        console.log(rows)
        return(
            <div>
                <table className="">
                    <thead >
                    <tr >
                        <th >Id</th>
                        <th>&nbsp;&nbsp;&nbsp;</th>
                        <th >Element</th>
                        <th> &nbsp;&nbsp;&nbsp;</th>
                        <th >Possible relative values</th>
                        <th> &nbsp;&nbsp;&nbsp;</th>
                        <th >Average relative value</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.filter(row => row.distances.length > 0).map(row => <tr key={row.id}>
                            <td className="" >{row.id}</td> 
                            <td>&nbsp;&nbsp;&nbsp;</td>
                            <td className="">{row.name}</td>
                            <td>&nbsp;&nbsp;&nbsp;</td>
                            <td className="">{abridgeArrayAndDisplay(row.distances)}</td>
                            <td>&nbsp;&nbsp;&nbsp;</td>
                            <td className="">{formatLargeOrSmall(avg(row.distances))}</td>
                    </tr>
                    )}
                    <tr className={rows[0].distances.length > 0 ? "hidden": ""}>
                        "Maximum compute exceeded, rely on the graph instead"
                    </tr>
                    {}
                    </tbody>
                </table>
            </div>
        )
    }
    
}


function CreateTableWithoutDistances({isListOrdered, orderedList, listOfElements, links}){
    if(!isListOrdered || orderedList.length < listOfElements.length){ 
        return (<div>{""}</div>)
    } else {
        let nodes = orderedList.map(i => listOfElements[i])
        let rows = nodes.map((element, i) => ({id: numToAlphabeticalString(element.id), name: element.name}))
        console.log("rows@CreateTableWithoutDistances")
        console.log(rows)
        return(
            <div>
                <table className="">
                    <thead >
                    <tr >
                        <th >Id</th>
                        <th>&nbsp;&nbsp;&nbsp;</th>
                        <th >Element</th>
                        <th> &nbsp;&nbsp;&nbsp;</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map(row => <tr key={row.id}>
                            <td className="" >{row.id}</td> 
                            <td>&nbsp;&nbsp;&nbsp;</td>
                            <td className="">{row.name}</td>
                    </tr>
                    )}
                    {}
                    </tbody>
                </table>
            </div>
        )
    }
    
}

export const CreateTable = CreateTableWithoutDistances;

/* Testing */
//import fs from 'fs';
//import path from 'path';
/*
const directory = path.join(process.cwd(),"pages")
let links = JSON.parse(fs.readFileSync(path.join(directory, 'distancesExample.json'), 'utf8'));
let nodes = JSON.parse(fs.readFileSync(path.join(directory, 'listOfPosts.json'), 'utf8'));

let paths = findPathsInner({sourceElementId:2, targetElementId:0, pathSoFar: [], links, nodes, maxLengthOfPath: 2})
console.log(JSON.stringify(paths, null, 2))
*/
/* 
let paths = findPaths({sourceElementId:2, targetElementId:0, links, nodes})
console.log(JSON.stringify(paths, null, 2))
*/
/*
let distances = findDistance({sourceElementId:2, targetElementId:4, links, nodes})
console.log(distances)
*/