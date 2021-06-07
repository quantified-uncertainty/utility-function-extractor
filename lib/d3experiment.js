import React, { useState, useEffect } from "react";
import * as d3 from 'd3';

export function drawChart(height, width){
    
    d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("border", "1px solid black")
        .append("text")
        .attr("fill", "green")
        .attr("x", 50)
        .attr("y", 50)
        .text("Hello D3")
}

export function drawCircles(){
    var svg = d3.select("#circles")
        .append("svg")
        .attr("width", 960)
        .attr("height", 500)
        .attr("bgcolor", "blue")

    var background = svg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "blue")
    
    var ball = svg.append("circle")
        .attr("r", 73)
        .attr("cx", 480)
        .attr("cy", 250)
        .style("fill", "#ffe41e");
}

export function drawGraph(){
    let margin = {top: 20, right: 30, bottom: 20, left: 30};
    let width = 900 - margin.left - margin.right;
    let height = 600 - margin.top - margin.bottom;

    var svg = d3.select("#graph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    let data = ({
        "nodes": [
          {
            "id": 1,
            "name": "A"
          },
          {
            "id": 2,
            "name": "B"
          },
          {
            "id": 3,
            "name": "C"
          },
          {
            "id": 4,
            "name": "D"
          },
          {
            "id": 5,
            "name": "E"
          },
          {
            "id": 6,
            "name": "F"
          },
          {
            "id": 7,
            "name": "G"
          },
          {
            "id": 8,
            "name": "H"
          },
          {
            "id": 9,
            "name": "I"
          },
          {
            "id": 10,
            "name": "J"
          }
        ],
        "links": [
      
          {
            "source": 1,
            "target": 2
          },
          {
            "source": 1,
            "target": 5
          },
          {
            "source": 1,
            "target": 6
          },
      
          {
            "source": 2,
            "target": 3
          },
                  {
            "source": 2,
            "target": 7
          }
          ,
      
          {
            "source": 3,
            "target": 4
          },
           {
            "source": 8,
            "target": 3
          }
          ,
          {
            "source": 4,
            "target": 5
          }
          ,
      
          {
            "source": 4,
            "target": 9
          },
          {
            "source": 5,
            "target": 10
          }
        ]
    })

    console.log(data)
    // List of node names
    var allNodes = data.nodes.map(function(d){return d.name})
    
    // A linear scale to position the nodes on the X axis
    var x = d3.scalePoint()
        .range([0, width])
        .domain(allNodes)
    
    // Add the circle for the nodes
    svg
        .selectAll("mynodes")
        .data(data.nodes)
        .enter()
        .append("circle")
        .attr("cx", function(d){ return(x(d.name))})
        .attr("cy", height-30)
        .attr("r", 8)
        .style("fill", "#69b3a2")
    
    // And give them a label
    svg
        .selectAll("mylabels")
        .data(data.nodes)
        .enter()
        .append("text")
        .attr("x", function(d){ return(x(d.name))})
        .attr("y", height-10)
        .text(function(d){ return(d.name)})
        .style("text-anchor", "middle")
    
    // Add links between nodes. Here is the tricky part.
    // In my input data, links are provided between nodes -id-, NOT between node names.
    // So I have to do a link between this id and the name
    var idToNode = {};
    data.nodes.forEach(function (n) {
        idToNode[n.id] = n;
    });
    // Cool, now if I do idToNode["2"].name I've got the name of the node with id 2
    
    // Add the links
    svg
        .selectAll('mylinks')
        .data(data.links)
        .enter()
        .append('path')
        .attr('d', function (d) {
            let start = x(idToNode[d.source].name)    
                // X position of start node on the X axis
            let end = x(idToNode[d.target].name)      
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
        .data(data.links)
        .enter()
        .append("text")
        .attr("x", function(d){ 
            let start = x(idToNode[d.source].name)    
                // X position of start node on the X axis
            let end = x(idToNode[d.target].name)      
                // X position of end node
            return start + (end-start)/2
        })
        .attr("y", function(d){ 
            let start = x(idToNode[d.source].name)    
                // X position of start node on the X axis
            let end = x(idToNode[d.target].name)      
                // X position of end node
            return height-30-(Math.abs(start-end)/2)//height-30
        })
        .text(function(d){ return(`${idToNode[d.source].name}-${idToNode[d.target].name}`)})
        .style("text-anchor", "top")

    svg.selectAll("text").data(data.links).enter()
    .append("text")
    .attr("x", function(d) { return d.source.x + (d.target.x - d.source.x)/2; })
    .attr("y", function(d) { return d.source.y + (d.target.y - d.source.y)/2; })
    .text(function(d) { return d.something; });


}

export function D3Experiment() {

    useEffect(() => {
        drawGraph();
    }, []);

    return (
        <div>
            <div id="chart">
            </div>
            <div id="circles">
            </div>
            <div id="graph">
            </div>
        </div>
    );

}


export default D3Experiment;