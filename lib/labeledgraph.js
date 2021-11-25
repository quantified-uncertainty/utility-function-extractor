import React, { useState, useEffect } from "react";
import * as d3 from 'd3';
import { toLocale, truncateValueForDisplay } from "../lib/utils.js"

let getlength = (number) => number.toString().length;

export function removeOldSvg(){
    d3.select("#graph").select("svg").remove();
}

function drawGraphInner({nodes, links}){
    
    // List of node ids for convenience
    var nodeids = nodes.map(node => node.id)
    var positionById = {}
    nodeids.forEach((nodeid, i) => positionById[nodeid]=i)
    console.log("NodeIds/positionById")
    console.log(nodeids)
    console.log(positionById)
    
    // Calculate the dimensions
    let margin = {top: 0, right: 30, bottom: 20, left: 30};
    let width = 900 - margin.left - margin.right;
    var x = d3.scalePoint()
        .range([0, width])
        .domain(nodeids)

    let heights = links.map(link => {
        let start = x(positionById[link.source])   
        let end = x(positionById[link.target])
        return Math.abs(start-end)/2+70 // Magic constant.
    })
    console.log(heights)
    let maxheight = Math.max(...heights)
    let height = maxheight - margin.top - margin.bottom;
    console.log(`height: ${height}`)

    // Build the d3 graph

    removeOldSvg()
    var svg = d3.select("#graph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    // A linear scale to position the nodes on the X axis

    
    // Add the circle for the nodes
    svg
        .selectAll("mynodes")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("cx", function(d){ return(x(d.id))})
        .attr("cy", height-30)
        .attr("r", 8)
        .style("fill", "#69b3a2")
    
    // And give them a label
    svg
        .selectAll("mylabels")
        .data(nodes)
        .enter()
        .append("text")
        .attr("x", function(d){ return(x(d.id))})
        .attr("y", height-10)
        .text(function(d){ return(d.id)})
        .style("text-anchor", "middle")
        
    // Add the links
    svg
        .selectAll('mylinks')
        .data(links)
        .enter()
        .append('path')
        .attr('d', function (d) {
            let start = x(d.source)    
                // X position of start node on the X axis
            let end = x(d.target)      
                // X position of end node
            return ['M', 
                start, 
                height-30,    
                    // the arc starts at the coordinate x=start, y=height-30 (where the starting node is)
                'A',                            
                    // This means we're gonna build an elliptical arc
                (start - end)/2, ',',    
                    // Next 2 lines are the coordinates of the inflexion point. Height of this point is proportional with start - end distance
                (start - end)/2, 0, 0, ',',
                start < end ? 1 : 0, end, ',', height-30] 
                    // We always want the arc on top. So if end is before start, putting 0 here turn the arc upside down.
            .join(' ');
        })
        .style("fill", "none")
        .attr("stroke", "black")
    
    // labels for links
    svg
        .selectAll('mylinks')
        .data(links)
        .enter()
        .append("text")
        .attr("x", function(d){ 
            let start = x(d.source)    
                // X position of start node on the X axis
            let end = x(d.target)      
                // X position of end node
            return start + (end-start)/2 //-4*getlength(d.distance)
        })
        .attr("y", function(d){ 
            let start = x(d.source)    
                // X position of start node on the X axis
            let end = x(d.target)      
                // X position of end node
            return height-32-(Math.abs(start-end)/2)//height-30
        })
        .text(function(d){ 
            return Number(d.distance)
            return(truncateValueForDisplay(Number(d.distance)))
            //return(Number(d.distance).toPrecision(2).toString())
        })
        .style("text-anchor", "middle")
}

export function DrawGraph({isListOrdered, orderedList, listOfElements, links}) {
    if(isListOrdered){
        let nodes = orderedList.map(i => listOfElements[i])
        drawGraphInner({ nodes, links});
    }
    return (
        <div>
            <div id="graph">
            </div>
        </div>
    );

}