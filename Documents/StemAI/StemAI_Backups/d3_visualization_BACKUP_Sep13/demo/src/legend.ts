import { select } from "d3";
import graph from "./input.json";

export function setupLegend(element: string) {

    const height = 400
    const width = 500

    const svg = select(element)
    .append("svg")
    .attr("height", height)
    .attr("width", width);
    // .style("border", "1px solid black");


    // Create the legend
    const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(25, 50)"); // Adjust the position of the legend

    const legend_data = [
                    {"label": "Timestep: 0", "id": "legendTimestep", "class": "none", "color": "black"},
                    {"label": "Number of Agents: 0" , "id": "numAgents", "class": "none",  "color": "black"},
                    {"label": "Green Edge: 1","class": "line", "color": "green"},
                    {"label": "Grey Edge: 0", "class": "line", "color": "grey"},
                    {"label": "Green Ring: Self-signal ", "class": "circle", "color": "green"},
                    {"label": "Green Node: Environment", "class": "circle", "color": "green"},
                    {"label": "Pink Node: Dividing", "class": "circle", "color": "pink"},
                    {"label": "Red Node: Dying", "class": "circle", "color": "red"},
                    {"label": "Yellow Node: Seed Cell", "class": "circle", "color": "yellow"},
                    {"label": "White-Black Node: Cell Self-Efficacy", "class": "circle", "color": "grey"},
                    {"label":"", "class": "divider", "color": "white"},
                    {"label": "Average Path Length: 0", "id": "legendAvgPathLength", "class": "none", "color": "white"},
                    {"label": "Global Clustering Coefficient: 0" , "id": "legendGlobalClusteringCoefficient", "class": "none",  "color": "white"},
                    {"label": "Global Efficiency: 0", "id": "legendGlobalEfficiency", "class": "none", "color": "white"},
                    {"label": "Degree Centralization: 0", "id": "legendDegreeCentralization", "class": "line", "color": "white"}
    ]

            
    const legendEntries = legend.selectAll(".legend-entry")
    .data(legend_data) // The categories to be displayed in the legend
    .enter()
    .append("g")
    .attr("class", "legend-entry")
    .attr("transform", (d, i) => `translate(0, ${i * 20})`);


    legend.selectAll(".divider")
            .data(legend_data.filter(d => d.class === "divider"))
            .enter()
            .append("line")
            .attr("class", "divider-line")
            .style("stroke", "black")
            .style("stroke-width", "3px")
            .attr("x1", 0)
            .attr("x2", "60%")
            .attr("y1", 205)
            .attr("y2", 205);




    legendEntries.append("rect")
    .attr("width", 15)
    .attr("height", 15)
    .attr("fill", d => {

    if (d.class === "none"){
        return "white"
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
