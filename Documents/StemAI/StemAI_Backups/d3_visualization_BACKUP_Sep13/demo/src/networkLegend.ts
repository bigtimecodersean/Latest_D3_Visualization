
import { select } from "d3";
import input_graph from "./input.json";

// import Graph from 'graphology';
// import {density} from 'graphology-metrics/graph/density';
// import {bidirectional} from 'graphology-shortest-path';
// import degreeAssortativity from 'graphology-metrics';

// const input_nodes = input_graph.nodes
// const input_links = input_graph.links

// Passing a graph instance


export function setupNetworkLegend(element: string) {

/// SETTING UP THE LEGEND 


    const height =300
    const width = 500

    const svg = select(element)
    .append("svg")
    .attr("height", height)
    .attr("width", width);
    // .style("border", "1px solid black");


    // Create the legend
    const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(100, 100)"); // Adjust the position of the legend

    const legend_data = [
      {"label": "Average Path Length: 0", "id": "legendAvgPathLength", "class": "none", "color": "white"},
      {"label": "Global Clustering Coefficient: 0" , "id": "legendGlobalClusteringCoefficient", "class": "none",  "color": "white"},
      {"label": "Global Efficiency: 0", "id": "legendGlobalEfficiency", "class": "none", "color": "white"},
      {"label": "Degree Centralization: 0", "id": "legendDegreeCentralization", "class": "line", "color": "white"},

    ]

    const legendEntries = legend.selectAll(".legend-entry")
    .data(legend_data) // The categories to be displayed in the legend
    .enter()
    .append("g")
    .attr("class", "legend-entry")
    .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    legendEntries.append("rect")
    .attr("width", 15)
    .attr("height", 15)
    .attr("fill", d => {

    if (d.class === "none"){
        return "black"
    }
    else{
        return d.color;

    }
    });

    legendEntries.append("text")
    .attr("x", 20)
    .attr("y", 10)
    .text(d => d.label)
    .attr("class", d => d.id || d.class);



}


