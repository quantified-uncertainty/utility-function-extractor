import React, { useState, useEffect } from "react";
import * as d3 from 'd3';

function getlength(number) {
    return number.toString().length;
}

function drawGraphInner({nodes, links}){
    
    // Build the d3 graph
    let margin = {top: 0, right: 30, bottom: 20, left: 30};
    let width = 900 - margin.left - margin.right;
    let height = 400 - margin.top - margin.bottom;

    var svg = d3.select("#graph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // List of node ids
    var nodeids = nodes.map(function(d){return d.id})
    var positionById = {}
    nodeids.forEach((nodeid, i) => positionById[nodeid]=i)
    
    // A linear scale to position the nodes on the X axis
    var x = d3.scalePoint()
        .range([0, width])
        .domain(nodeids)
    
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
            let start = x(positionById[d.source])    
                // X position of start node on the X axis
            let end = x(positionById[d.target])      
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
            let start = x(positionById[d.source])    
                // X position of start node on the X axis
            let end = x(positionById[d.target])      
                // X position of end node
            return start + (end-start)/2 -4*getlength(d.distance)
        })
        .attr("y", function(d){ 
            let start = x(d.source)    
                // X position of start node on the X axis
            let end = x(d.target)      
                // X position of end node
            return height-32-(Math.abs(start-end)/2)//height-30
        })
        .text(function(d){ return(`${d.distance}`)})
        .style("text-anchor", "top")

    


}

export function DrawGraph({isListOrdered, nodes, links}) {
    
    if(isListOrdered){
        drawGraphInner({ nodes, links});
    }
    
    return (
        <div>
            <div id="graph">
            </div>
        </div>
    );

}