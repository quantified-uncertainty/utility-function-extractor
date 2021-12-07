/* Imports*/
import React from "react";
import { toLocale, truncateValueForDisplay, numToAlphabeticalString, formatLargeOrSmall } from "../lib/utils.js"

/* Utilities */
let avg = arr => arr.reduce((a, b) => (a + b), 0) / arr.length

/* Main function */

function findPathsInner({ sourceElementId, targetElementId, pathSoFar, links, nodes, maxLengthOfPath }) {
    let paths = []

    if (maxLengthOfPath > 0) {
        for (let link of links) {
            if (
                ((link.source == sourceElementId) && (link.target == targetElementId)) ||
                ((link.source == targetElementId) && (link.target == sourceElementId))
            ) {
                paths.push(pathSoFar.concat(link).flat())
            } else if ((link.source == sourceElementId)) {
                let newPaths = findPathsInner({ sourceElementId: link.target, targetElementId, pathSoFar: pathSoFar.concat(link).flat(), links, nodes, maxLengthOfPath: (maxLengthOfPath - 1) })
                if (newPaths.length != 0) {
                    paths.push(...newPaths)
                }
            } else if ((link.target == sourceElementId)) {
                let newPaths = findPathsInner({ sourceElementId: link.source, targetElementId, pathSoFar: pathSoFar.concat(link).flat(), links, nodes, maxLengthOfPath: (maxLengthOfPath - 1) })
                if (newPaths.length != 0) {
                    paths.push(...newPaths)
                }
            }
        }
    }

    return paths
}

function findPaths({ sourceElementId, targetElementId, links, nodes }) {
    let positionSourceElement = nodes.map((element, i) => (element.id)).indexOf(sourceElementId)
    let positionTargetElement = nodes.map((element, i) => (element.id)).indexOf(targetElementId)
    let maxLengthOfPath = Math.abs(positionSourceElement - positionTargetElement)

    return findPathsInner({ sourceElementId, targetElementId, pathSoFar: [], links, nodes, maxLengthOfPath })
}

function findDistance({ sourceElementId, sourceElementPosition, targetElementId, targetElementPosition, nodes, links, direction }) {
    let paths = findPaths({ sourceElementId, targetElementId, nodes, links })
    console.log(`findDistance from ${sourceElementPosition} to ${targetElementPosition}`)
    console.log(targetElementId)
    console.log(direction)
    console.log(paths)
    let weights = []
    for (let path of paths) {
        let currentSource = sourceElementId
        let weight = 1
        for (let element of path) {
            let distance = 0
            if (element.source == currentSource) {
                distance = element.distance
                currentSource = element.target
            } else if (element.target == currentSource) {
                distance = 1 / Number(element.distance)
                currentSource = element.source
            }
            weight = weight * distance

        }
        weights.push(weight)
    }
    //let sum = JSON.stringify(weights)//weights.length > 0 ? weights.reduce((a,b) => (a+b)) / weights.length : "Not found"
    //return sum
    return weights
    //return weights.map(weight => Math.round(weight*100)/100)
}

function getDirectionalLinks({ nodes, links }) {
    console.log("getDirectionalLinks")
    // direction: 1 for upwards, -1 for downwards
    let upwardsLinks = []
    let downwardsLinks = []
    links.forEach(link => {
        console.log(link)
        let sourceElementId = link.source
        let targetElementId = link.target
        if (link.distance < 1) {
            // We already deal with this case upstream, but whatever.
            [sourceElementId, targetElementId] = [targetElementId, sourceElementId]
        }
        let sourceElementPosition = nodes.find(element => element.id == sourceElementId).position
        let targetElementPosition = nodes.find(element => element.id == targetElementId).position
        if (link.distance == 1) {
            // If two elements are the same, then they belong to both upwards and downwards paths!!
            upwardsLinks.push(link)
            downwardsLinks.push(link)
        } else if (sourceElementPosition < targetElementPosition) {
            upwardsLinks.push(link)
        } else {
            downwardsLinks.push(link)
        }
    })
    console.log([upwardsLinks, downwardsLinks])
    return [upwardsLinks, downwardsLinks]
}

function findDistancesForAllElements({ nodes, links }) {
    let referenceElements = nodes.filter(x => x.isReferenceValue)
    let midpoint = Math.round(nodes.length / 2)
    let referenceElement = referenceElements.length > 0 ? referenceElements[0] : nodes[midpoint]
    // console.log(nodes)
    let [upwardsLinks, downwardsLinks] = getDirectionalLinks({ nodes, links })
    console.log(`referenceElement.position: ${referenceElement.position}`)
    let distances = nodes.map(node => {
        if (node.isReferenceValue || (node.id == referenceElement.id)) {
            return [1]
        } else {
            console.log("node")
            console.log(node)
            let isUpwardsDirection = referenceElement.position < node.position;
            let distance = findDistance({
                sourceElementId: referenceElement.id,
                sourceElementPosition: referenceElement.position,
                targetElementId: node.id,
                targetElementPosition: node.position,
                nodes: nodes,
                links: links, // isUpwardsDirection ? upwardsLinks : downwardsLinks, // links
                direction: isUpwardsDirection ? "upwards" : "downwards"
            })
            return distance
        }
    })
    return distances
}

function abridgeArrayAndDisplay(array) {
    let newArray
    let formatForDisplay
    if (array.length > 10) {
        newArray = array.slice(0, 9)
        formatForDisplay = newArray.map(d => formatLargeOrSmall(d))
        formatForDisplay[9] = "..."
    } else {
        newArray = array
        formatForDisplay = newArray.map(d => formatLargeOrSmall(d))
    }
    let result = JSON.stringify(formatForDisplay, null, 2).replaceAll(`"`, "")
    return result
}

export function CreateTableWithDistances({ isListOrdered, orderedList, listOfElements, links }) {
    if (!isListOrdered || orderedList.length < listOfElements.length) {
        return (<div>{""}</div>)
    } else {
        let nodes = orderedList.map((id, pos) => ({ ...listOfElements[id], position: pos }))
        let distances = findDistancesForAllElements({ nodes, links })
        let rows = nodes.map((element, i) => ({ id: numToAlphabeticalString(element.position), position: element.position, name: element.name, distances: distances[i] }))
        console.log("rows@CreateTableWithDistances")
        console.log(rows)
        return (
            <div>
                <table className="">
                    <thead >
                        <tr >
                            <th >Id</th>
                            <th>&nbsp;&nbsp;&nbsp;</th>
                            <th >Position</th>
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
                            <td className="" >{row.position}</td>
                            <td>&nbsp;&nbsp;&nbsp;</td>
                            <td className="">{row.name}</td>
                            <td>&nbsp;&nbsp;&nbsp;</td>
                            <td className="">{abridgeArrayAndDisplay(row.distances)}</td>
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

function CreateTableWithoutDistances({ isListOrdered, orderedList, listOfElements, links }) {
    if (!isListOrdered || orderedList.length < listOfElements.length) {
        return (<div>{""}</div>)
    } else {
        let nodes = orderedList.map(i => listOfElements[i])
        let rows = nodes.map((element, i) => ({ id: numToAlphabeticalString(element.id), name: element.name }))
        console.log("rows@CreateTableWithoutDistances")
        console.log(rows)
        return (
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
                        { }
                    </tbody>
                </table>
            </div>
        )
    }

}

export const CreateTable = CreateTableWithDistances // CreateTableWithoutDistances;

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