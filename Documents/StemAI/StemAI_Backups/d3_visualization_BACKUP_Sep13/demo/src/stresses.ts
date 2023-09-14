import { select, scaleLinear, line, curveLinear, axisBottom, axisLeft } from "d3";
import graph from "./input.json";
// import graph from "./TEST_data.json";

import { groupBy, uniqBy, values } from "lodash";


const cellMap: Record<string,string> = {
    "all": "blue"
}

const colorArray = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928']

function shuffleArray(array: any) {
    return array.sort(() => Math.random() - 0.5);
  }

const shuffledColorArray = shuffleArray(colorArray);


// Creating a function to plot a low opacity at the very beginning (called in main.ts))

export function setupStresses(element: string) {

    const full_data = graph.stresses
 
    // SVG dimensions
    const width = 600;
    const height = 400;
    const margin = { top: 50, right: 30, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const timesteps = full_data['avg'].length

    // let maxValue = -Infinity;

    
    // for (const key in Object.keys(full_data)) {
    //     if (full_data[key] > maxValue) {
    //       maxValue = full_data[key]; 
    //     }
    //   }
      
    //   console.log(maxValue);

    
    const svg = select(element)
        .append("svg")
        .attr("height", height)
        .attr("width", width);

    const xScale = scaleLinear()
        .domain([0, timesteps])
        .range([0, innerWidth]);

    const yScale = scaleLinear()
        .domain([0,10])
        .range([innerHeight, 0]);

    const line_generators = [] 

    for (const cell in Object.keys(full_data)) {

        const lineGenerator = line<{ time: number; value: number }>()
            .x(d => xScale(d.time))
            .y(d => yScale(d.value))
            .curve(curveLinear);

        line_generators.push(lineGenerator);

    }

    // Create graph area
    const graphGenerator = svg.selectAll(".stressesGroup")
        .data([0])
        .join("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    line_generators.forEach((lineGenerator, index) => {
        graphGenerator
              .selectAll(`.stressesTimeline-${index}`)
              .data([Object.values(full_data)[index]])
              .join("path")
              .attr("class", `stressesTimeline-${index}`)
              .attr("d", d => lineGenerator(d))
              .attr("stroke", shuffledColorArray[index])
              .attr("fill", "none")
              .attr("opacity", .3);
          });

    line_generators.forEach((lineGenerator, index) => {
            graphGenerator
                  .selectAll(`.Stresses-${index}`)
                  .data([Object.values(full_data)[index].slice(0,1)])
                  .join("path")
                  .attr("class", `Stresses-${index}`)
                  .attr("d", d => lineGenerator(d))
                  .attr("stroke", shuffledColorArray[index])
                  .attr("fill", "none")
                  .attr("opacity", 1);
              });


    // Add x-axis
    graphGenerator.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(axisBottom(xScale));

    // Add y-axis
    graphGenerator.append("g")
        .call(axisLeft(yScale));

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", margin.top / 2) // Positioned above the graph
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .text("Stresses");


    // Add legend

    const legendData: { label: string; color: string }[] = [];

    Object.keys(full_data).forEach((key, index) => {
        legendData.push({ label: key, color: shuffledColorArray[index] });
      });



    const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${ margin.left + 400},${margin.top })`);  

    const legendItems = legend.selectAll(".legend-item")
    .data(legendData)
    .enter().append("g")
    .attr("class", "legend-item")
    .attr("transform", (d, i) => `translate(0, ${i * 20})`);  

    legendItems.append("circle")
    .attr("cx", 10)
    .attr("cy", -5)
    .attr("r", 5)
    .style("fill", d => d.color);

    legendItems.append("text")
    .attr("x", 20)
    .attr("y", 0)
    .text(d => d.label);
    
}


// Creating a function to plot a high opacity line up until a given timestamp (called in preRender)

export function animateStresses(element: string, timestamp: number) {
    const full_data = graph.stresses

    // SVG dimensions
    const width = 600;
    const height = 400;
    const margin = { top: 50, right: 30, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const timesteps = full_data['avg'].length

    // Create scales

    const xScale = scaleLinear()
        .domain([0, timesteps])
        .range([0, innerWidth]);

    const yScale = scaleLinear()
        .domain([0,10])
        .range([innerHeight, 0]);

    // create a line generator for each key in the dictionary 

    const line_generators = [] 

    for (const cell in Object.keys(full_data)) {

        const lineGenerator = line<{ time: number; value: number }>()
            .x(d => xScale(d.time))
            .y(d => yScale(d.value))
            .curve(curveLinear);

        line_generators.push(lineGenerator);

    }


    // select an element for each line generator 

    line_generators.forEach((lineGenerator, index) => {
        select(element)
          .selectAll(`.Stresses-${index}`)
          .data([Object.values(full_data)[index].slice(0, timestamp)])
          .join("path")
          .attr("class", `Stresses-${index}`)
          .attr("d", d => lineGenerator(d))
          .attr("stroke", shuffledColorArray[index])
          .attr("fill", "none")
          .attr("opacity", 1);
      });







    
}

