/* Imports*/
import React from "react";

/* Utilities */
let avg = arr => arr.reduce((a,b) => (a+b)) / arr.length

/* Main function */

function findPathsInner({sourceElementId, targetElementId, pathSoFar, links, listOfElements, maxLengthOfPath}){
    let paths = []

    if(maxLengthOfPath > 0){
        for(let link of links){
            if(
                ((link.source == sourceElementId) && (link.target == targetElementId)) || 
                ((link.source == targetElementId) && (link.target == sourceElementId))
            ){
                paths.push(pathSoFar.concat(link).flat())
                //console.log(`Final path found at recursion level: ${maxLengthOfPath}. Source: ${sourceElementId}, target=${targetElementId}`)
                //console.log(link)
            } else if((link.source == sourceElementId)){
                let newPaths = findPathsInner({sourceElementId:link.target, targetElementId, pathSoFar: pathSoFar.concat(link).flat(), links, listOfElements, maxLengthOfPath: (maxLengthOfPath-1)})
                if(newPaths.length != 0){
                    //console.log(`New link, at recursion level: ${maxLengthOfPath}. Source: ${sourceElementId}, target=${targetElementId}. PathSoFar: ${pathSoFar}`)
                    //console.log(link)
                    //console.log(newPaths)
                    paths.push(...newPaths)
                }
            }else if((link.target == sourceElementId)){
                let newPaths = findPathsInner({sourceElementId:link.source, targetElementId, pathSoFar: pathSoFar.concat(link).flat(), links, listOfElements, maxLengthOfPath: (maxLengthOfPath-1)})
                if(newPaths.length != 0){
                    //console.log(`New link, at recursion level: ${maxLengthOfPath}. Source: ${sourceElementId}, target=${targetElementId}. PathSoFar: ${pathSoFar}`)
                    //console.log(link)
                    //console.log(newPaths)
                    paths.push(...newPaths)
                }
            }
            
        }
    }

    return paths
}

function findPaths({sourceElementId, targetElementId, links, listOfElements}){
    let positionSourceElement = listOfElements.map((element, i) => (element.id)).indexOf(sourceElementId)
    let positionTargetElement = listOfElements.map((element, i) => (element.id)).indexOf(targetElementId)
    let maxLengthOfPath = Math.abs(positionSourceElement - positionTargetElement)
    console.log(maxLengthOfPath)
    
    return findPathsInner({sourceElementId, targetElementId, pathSoFar: [], links, listOfElements, maxLengthOfPath})
}

function findDistance({sourceElementId, targetElementId, links, listOfElements}){
    let paths = findPaths({sourceElementId, targetElementId, links, listOfElements})
    // console.log(paths)
    let weights = []
    for(let path of paths){
        let currentSource = sourceElementId
        let weight = 1
        // console.log(path)
        for(let element of path){
            // console.log(element)
            // console.log(element.source)
            // console.log(element.target)
            let distance = 0
            if(element.source == currentSource){
                // console.log("A")
                distance = element.distance
                currentSource = element.target
            }else if(element.target == currentSource){
                // console.log("B")
                distance = 1/Number(element.distance)
                currentSource = element.source
            }
            weight = weight*distance
            // console.log(weight)
            
        }
        weights.push(weight)
    }
    //let sum = JSON.stringify(weights)//weights.length > 0 ? weights.reduce((a,b) => (a+b)) / weights.length : "Not found"
    //return sum
    return weights.map(weight => Math.round(weight*100)/100)
}

function findDistancesForAllElements({links, listOfElements}){
    let referenceElement = listOfElements.filter(x => x.isReferenceValue)[0]
    console.log(referenceElement.id)
    let distances = listOfElements.map(element =>{
        if(element.isReferenceValue){
            return [1]
        }else{
            // console.log({sourceElementId: referenceElement.id, targetElementId: element.id, links, listOfElements})
            return findDistance({sourceElementId: Number(referenceElement.id), targetElementId: Number(element.id), links, listOfElements})
        }
    })
    return distances
}

export function CreateTableWithDistances({isListOrdered, quantitativeComparisons, listOfElements, referenceValueId}){
    if(!isListOrdered){ // listOfElements
        console.log
        console.log("List of Elements: ")
        console.log(listOfElements)
        return (<div></div>)
    } else {
        console.log(`isListOrdered: ${isListOrdered}`)
        console.log("List Of Elements:")
        console.log(listOfElements)
        let links = quantitativeComparisons.map(([element1, element2, distance]) => ({source: element1, target: element2, distance: distance}))
        
        let distances = findDistancesForAllElements({links, listOfElements})

        let rows = listOfElements.map((element, i) => ({id: element.id, name: element.name, distances: distances[i]}))

        return(<div>
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
              {rows.map(row => <tr>
                    <td className="">{row.id}</td> 
                    <td>&nbsp;&nbsp;&nbsp;</td>
                    <td className="">{row.name}</td>
                    <td>&nbsp;&nbsp;&nbsp;</td>
                    <td className="">{JSON.stringify(row.distances, null, 2)}</td>
                    <td>&nbsp;&nbsp;&nbsp;</td>
                    <td className="">{avg(row.distances).toFixed(2)}</td>
              </tr>
              )}
            </tbody>
          </table>
        </div>
)
    }
    
}

/* Testing */
//import fs from 'fs';
//import path from 'path';
/*
const directory = path.join(process.cwd(),"pages")
let links = JSON.parse(fs.readFileSync(path.join(directory, 'distancesExample.json'), 'utf8'));
let listOfElements = JSON.parse(fs.readFileSync(path.join(directory, 'listOfPosts.json'), 'utf8'));

let paths = findPathsInner({sourceElementId:2, targetElementId:0, pathSoFar: [], links, listOfElements, maxLengthOfPath: 2})
console.log(JSON.stringify(paths, null, 2))
*/
/* 
let paths = findPaths({sourceElementId:2, targetElementId:0, links, listOfElements})
console.log(JSON.stringify(paths, null, 2))
*/
/*
let distances = findDistance({sourceElementId:2, targetElementId:4, links, listOfElements})
console.log(distances)
*/