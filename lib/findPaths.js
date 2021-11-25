/* Imports*/
import React from "react";
import { toLocale, truncateValueForDisplay } from "../lib/utils.js"

/* Utilities */
let avg = arr => arr.reduce((a,b) => (a+b)) / arr.length
let formatLargeOrSmall = num => {
    if(num > 1){
        return toLocale(truncateValueForDisplay(num))
    }else if(num > 0){
        return num.toFixed(-Math.floor(Math.log(num)/Math.log(10)));
    }else if(num > -1){
        return num.toFixed(-Math.floor(Math.log(-num)/Math.log(10)));
    }else{
        return toLocale(num)//return "~0"

    }
}

/* Main function */

function findPathsInner({sourceElementId, targetElementId, pathSoFar, links, nodes, maxLengthOfPath}){
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
    
    return findPathsInner({sourceElementId, targetElementId, pathSoFar: [], links, nodes, maxLengthOfPath})
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

export function CreateTableWithDistances({isListOrdered, orderedList, listOfElements, links}){
    if(!isListOrdered || orderedList.length < listOfElements.length){ 
        return (<div>{""}</div>)
    } else {
        let nodes = orderedList.map(i => listOfElements[i])
        let distances = findDistancesForAllElements({nodes, links})
        let rows = nodes.map((element, i) => ({id: element.id, name: element.name, distances: distances[i]}))
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
                    {rows.map(row => <tr key={row.id}>
                            <td className="" >{row.id}</td> 
                            <td>&nbsp;&nbsp;&nbsp;</td>
                            <td className="">{row.name}</td>
                            <td>&nbsp;&nbsp;&nbsp;</td>
                            <td className="">{JSON.stringify(row.distances.map(d => formatLargeOrSmall(d)), null, 2).replaceAll(`"`, "")}</td>
                            <td>&nbsp;&nbsp;&nbsp;</td>
                            <td className="">{formatLargeOrSmall(avg(row.distances))}</td>
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