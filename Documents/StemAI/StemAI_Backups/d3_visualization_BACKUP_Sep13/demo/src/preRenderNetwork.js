// Import styles and data
// @ts-nocheck
import "./style.css";
import rawData from "./input.json"
import { calculateNetworkStatistics } from './calculateNetworkStatistics.ts';

import { animateNumCells } from "./numCells"
import { animateMessages } from "./messages"
import { animateNailed } from "./nailed";
import { animateSeedCellSuffering } from "./seedCellSuffering";
import { animateSelfEfficacies } from "./selfEfficacies";
import { animateStemnesses } from "./stemnesses";
import { animateStresses } from "./stresses";


import * as d3 from "d3";
import {drag} from "d3"
import { filter } from "lodash";


export function getURLParameter(parameterName) {
  const currentURL = window.location.href;
  const queryString = currentURL.split("?")[1];
  const searchParams = new URLSearchParams(queryString);
  return searchParams.get(parameterName);
}



// console.log("rawData.max_timestamps", rawData.max_timestamps)

export function setupNetwork(playButton) {

  const test_SVG = document.querySelector("#prerender_chart")

  const data = {
    nodes: rawData.nodes.map((d) => ({
      ...d,
      start: d.start,
      end: d.end
    })),
    links: rawData.links.map((d) => ({
      ...d,
      start: d.start,
      end: d.end
    }))
  };

  const width = 480;
  const height = 300;

  const fixNodes = {
    env: { x: 10, y: -100, rx: 50, ry: 30 },
    seed: { x: 10, y: 10, rx: 10, ry: 10 }
  };

  // console.log('test svg', test_SVG)


  // medium constrast pairing: shared root color 

  const simulation = d3
    .forceSimulation()
    .alpha(1) // Initial value of alpha
    .alphaDecay(.5)
    .force("charge", d3.forceManyBody().strength(50))
    .force(
      "link",
      d3
        .forceLink()
        .id((d) => d.id)
        .distance(100)
    )
    .force(
      "collide",
      // d3.forceCollide().radius((d) => 15 + (d.id % 10))
      d3.forceCollide().radius((d) => {
        if(d.class === "env"){
          return fixNodes.env.rx*1.8
        }
        else {return fixNodes.seed.rx*4}

      })
    )
    .force("center", d3.forceCenter(fixNodes.seed.x, fixNodes.seed.y))
    
    // .force("x", d3.forceX())
    // .force("y", d3.forceY())
    .on("tick", onTick);

  const svg = d3
    
    .select(test_SVG)
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width/2, -height/2 , width, height]);


  // let zoom = d3.zoom()
  //   .on('zoom', handleZoom);

  // function handleZoom(e) {
  //     d3.select('svg g')
  //       .attr('transform', e.transform);
  //   }
  
  // function initZoom() {
  //     d3.select('svg')
  //       .call(zoom);
  //   }

  // initZoom();

  let link = svg
    .append("g")
    .attr("stroke", "#399")
    .style("stroke-dasharray", 5)
    .style("stroke-width", 3)
    .attr("stroke-opacity", 1)
    .selectAll("line");

  let node = svg
    .append("g")
    // .attr("stroke", "black")
    // .attr("fill", "black")
    // .attr("stroke-width", 1.5)
    .selectAll("ellipse");

  // .selectAll("circle");

  let arrowhead = svg
    .append("g")
    // .append("defs")
    .append("marker")
    .attr("id", "arrowhead")
    .attr("markerUnits", "strokeWidth")
    .attr("markerWidth", "10")
    .attr("markerHeight", "8")
    .attr("fill", "green")
    .attr("opacity", 1)
    .attr("viewBox", "0 0 15 15")
    .attr("refX", "16")
    .attr("refY", "5")
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,0 L10,5 L0,10 Z") // Customize the path to create your arrowhead shape
    .attr("class", "arrowhead");
 
  function onTick() {
    node
      // .attr("cx", (d) => d.x)
      .attr("cx", (d) => {
        if (d.class === "env") {
          d.x = fixNodes.env.x;
          return d.x;
        } else if (d.class === "seed") {
          d.x = fixNodes.seed.x;
          return d.x;
        } else {
          return d.x;
        }
        // return d.x;
      })

      .attr("cy", (d) => {
        if (d.class === "env") {
          d.y = fixNodes.env.y;
          return d.y;
        } else if (d.class === "seed") {
          d.y = fixNodes.seed.y;
          return d.y;
        } else {
          return d.y;
        }
        // return d.y;
      })
      .call(
        drag()
          .on("start", function (event) {
            if (!event.active) simulation.alphaTarget(.3).restart();
            select(this).raise().attr("stroke", "black");
          })
          .on("drag", function (event, d) {
            // select(this)
            //   .attr("cx", (d.x = event.x))
            //   .attr("cy", (d.y = event.y));
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", function (event, d) {
            if (!d.fixed) {
              d.fx = event.x;
              d.fy = event.y;
              d.fixed = true;
            } else {
              d.fx = null;
              d.fy = null;
              d.fixed = false;
            }
            // select(this).raise().attr("stroke", ");
            select(this).attr("stroke", null);
          })
      )
      ;

 
    link

      .attr("x1", (d) => {
        if (d.source.class === "env") {
          return fixNodes.env.x;
        } else if (d.source.class === "seed") {
          return fixNodes.seed.x;
        } else {
          return d.source.x;
        }
        // return d.source.x;
      })

      .attr("y1", (d) => {
        if (d.source.class === "env") {
          return fixNodes.env.y;
        } else if (d.source.class === "seed") {
          return fixNodes.seed.y;
        } else {
          d.y = d.source.y;
          return d.y;
        }
        // return d.source.y;
      })

      .attr("x2", (d) => {
        if (d.target.class === "env") {
          return fixNodes.env.x;
        } else if (d.target.class === "seed") {
          return fixNodes.seed.x;
        } else {
          return d.target.x;
        }
        // return d.target.x;
      })

      .attr("y2", (d) => {
        if (d.target.class === "env") {
          return fixNodes.env.y;
        } else if (d.target.class === "seed") {
          return fixNodes.seed.y;
        } else {
          d.y = d.target.y;
          return d.y;
        }
        // return d.target.y;
      })
      .attr("class", "networkLink")
      .attr("marker-end", "url(#arrowhead)")

      // .attr("stroke-width", (d) => (d.target.id + d.source.id) % 10);
  }

  

  const chart = Object.assign(svg.node(), {
    update({ nodes, links }, time) {
      // const old = new Map(node.data().map((d) => [d.id, d]));
      // nodes = nodes.map((d) => ({ ...d }));
      // links = links.map((d) => ({ ...d }));
      // tick_index++;

      console.log("NODES", nodes)
      // get all of the self efficacies as a list 
      const SE_filteredNodes = nodes.filter(node => node.class === "non_seed");

      let max_SE = Number.NEGATIVE_INFINITY; // Initialize max_SE with a very small value
      let min_SE = Number.POSITIVE_INFINITY; // Initialize min_SE with a very large value

      for (const node of SE_filteredNodes) {
        // get the max self efficacy value up until a timestamp 
        for (const key in node.self_efficacy) {
          const numericKey = Number(key); // Convert the key to a number
          if (!isNaN(numericKey) && numericKey == time) {
            const value = Number(node.self_efficacy[key]); // Convert the value to a number

            if (!isNaN(value)) {
              if (value > max_SE) {
                max_SE = value;
              }
              if (value < min_SE) {
                min_SE = value;
              }
            }
          }
        }
      }

      console.log("max SE", max_SE)
      console.log("min SE", min_SE)

  
      let zoom = d3.zoom()
      .on('zoom', handleZoom)
      .scaleExtent([.2, 1])
      // .translateExtent([[0, 0], [300, 300]]);
  
      function handleZoom(e) {
        d3.select('svg')
          .attr('transform', e.transform);
      }
    
      function initZoom() {
        d3.select('svg')
          .call(zoom);
      }
  
      initZoom(); 


      node = node
        .data(nodes, (d) => d.id)

        .join(
          (enter) =>
            // enter.append("circle").attr("r", (d) => 5 + (d.id % 10))
            enter
              .append("ellipse")
              .attr("stroke-width", 3)
              .attr("fill", (d) => {
                // console.log("TIME", time);
                if (d.class === "env") {

                  return d3.hsl("green");
                } else if (d.will_die[time] === "1") {
                  return d3.hsl("red");
                } else if (d.will_divide[time] === "1") {
                  return d3.hsl("pink");
                } else if (d.class === "seed") {

                  return d3.hsl("yellow");
                } else {
                  const color_NEW = d3.hsl("black")
                  console.log("enter self efficacy", d.self_efficacy[time])
                  color_NEW.l = Math.min(.9, 1-((d.self_efficacy[time] - min_SE) / (max_SE - min_SE)))
                  return color_NEW;
                }
              })
              .attr("stroke", (d) => {
                if (d.self_signal[time] === "1") {
                  return "green";
                }
                else if (d.class === "env") {
                  return "green";
                }
                else if (d.class === "seed") {
                  if (d.will_divide[time] === "1"){
                    return "pink"
                  }
                  else {return "yellow";}
                }
                else if (d.will_die[time] === "1") {
                  return "red";
                }
                else if (d.will_divide[time] === "1") {
                  return "pink";
                }
                
              })
              .attr("rx", (d) => {
                if (d.class === "env") {
                  return fixNodes.env.rx;
                } else {
                  return 10;
                }
              })
              .attr("ry", (d) => {
                if (d.class === "env") {
                  return fixNodes.env.ry;
                } else {
                  return 10;
                }
              })
              // .attr("opacity", d => {  
              //   if (d.class === "non_seed") {
              //     console.log("self efficacy", d.self_efficacy[time])
              //     console.log("opacity", parseInt(d.self_efficacy[time]) + .2)
              //     return parseInt(d.self_efficacy[time]) + .2
              //   }
              //   else {
              //     return 1
              //   }
              // })
              // .selection()
              ,

          (update) =>
            update
              .attr("fill", (d) => {
                // console.log("TIME", time);
                if (d.class === "env") {
                  return d3.hsl("green");
                } else if (d.will_die[time] === "1") {
                  return d3.hsl("red");
                } else if (d.will_divide[time] === "1") {
                  return d3.hsl("pink");
                } else if (d.class === "seed") {
                  return d3.hsl("yellow");
                } else {
                  const color_NEW = d3.hsl("black")
                  color_NEW.l = Math.min(.9, 1-((d.self_efficacy[time] - min_SE) / (max_SE - min_SE)) )
                  // console.log("self efficacy", d.self_efficacy[time])
                  // console.log("NEW COLOR", color_NEW)
                  return color_NEW;
                }
              })
              .attr("stroke", (d) => {
                if (d.self_signal[time] === "1") {
                  return "green";
                }
                else if (d.class === "env") {
                  return "green";
                }
                else if (d.class === "seed") {
                  if (d.will_divide[time] === "1"){
                    return "pink"
                  }
                  else {return "yellow";}
                }
                else if (d.will_die[time] === "1") {
                  return "red";
                }
                else if (d.will_divide[time] === "1") {
                  return "pink";
                }
                
              })
              .attr("rx", (d) => {
                if (d.class === "env") {
                  return fixNodes.env.rx;
                } else {
                  return 10;
                }
              })
              .attr("ry", (d) => {
                if (d.class === "env") {
                  return fixNodes.env.ry;
                } else {
                  return 10;
                }
              })
              
        );

        // link = link
        // .data(links, (d) => [d.source, d.target])
        // .join(
        //   (enter) =>
        //     enter
        //       .append("line")
        //       .style("stroke-dasharray", 5)
        //       .style("stroke-width", 3),
      
        //   (update) => {
        //     // Calculate the color based on the condition
        //     const lineColor = d.signal[time] === "1" ? "green" : "orange";
      
        //     // Set the stroke color for lines
        //     update.attr("stroke", lineColor);
      
        //     // // Set the arrowhead color
        //     // d3.select("#arrowhead")
        //     //   .style("fill", lineColor);
        //   }
        // );

        link = link
        .data(links, (d) => [d.source, d.target])
        // .join("line")
        .join(
          (enter) =>
            enter
              .append("line")
              .attr("stroke", (d) => (d.signal[time] === "1" ? "green" : "orange"))
              .style("stroke-dasharray", 5)
              .style("stroke-width", 3)
              .attr("marker-end", "url(#arrowhead)"),

          (update) =>
            update
              .attr("stroke", (d) =>
                d.signal[time] === "1" ? "green" : "orange"
              )   
        );

       

        // arrowhead.attr("fill", "blue")



      simulation.nodes(nodes);
      simulation.force("link").links(links);
      simulation.alpha(.9).restart().tick();
      onTick();
    }
  });

  const contains = ({ start, end }, time) =>
    start <= time && time < end;

  function update(time) {

    
    const nodes = data.nodes.filter((d) => contains(d, time));
    // const links1 = data.links.filter((d) => contains(d, time));
    const links = data.links.filter((d) => contains(d, time)).filter((d) => d.source !== d.target);
  
    chart.update({ nodes, links }, time);

    const {
      avgPathLength,
      avgClusteringCoefficient,
      efficiency,
      centralization
    } = calculateNetworkStatistics(nodes, links);

    // console.log("avgPathLength", avgPathLength)
    d3.select(".legendAvgPathLength").text(`Average Path Length: ${avgPathLength}`) 
    d3.select(".legendGlobalClusteringCoefficient").text(`Global Clustering Coefficient: ${avgClusteringCoefficient}`)
    d3.select(".legendGlobalEfficiency").text(`Global Efficiency: ${efficiency}`)
    d3.select(".legendDegreeCentralization").text(`Degree Centralization: ${centralization}`) 

  /////------------------------------------------------------------------------------

    // console.log("New Time", time);
    d3.select(".legendTimestep").text(`Timestep: ${time}`)

    d3.select("#currentTimestampLabel").text(time);
    d3.select("#timeslider").attr("value", time);
    // d3.select("#timeslider").attr("value", URL_timestep);
    
    d3.select(".numAgents").text(`Number of Agents ${nodes.length - 1}`)
      
    animateMessages(time+1) // why does it only work with time + 1 ? 
    animateNumCells("#numCells", time+1)
    animateNailed("#nailed", time+1)
    animateSeedCellSuffering("#seedCellSuffering", time+1)
    animateSelfEfficacies("#selfEfficacies", time+1)
    animateStemnesses("#Stemnesses", time+1)
    animateStresses("#stresses", time+1)
  }

  const times = d3
    // .scaleTime()
    .scaleLinear()
    // .domain([
    //   d3.min(data.nodes, (d) => d.start),
    //   d3.max(data.nodes, (d) => d.end)
    // ])
    .domain([
      // d3.min(rawData.nodes, (d) => d.start),
      // d3.max(rawData.nodes, (d) => d.end)
      0, rawData.max_timestamps
    ])
    .ticks(rawData.max_timestamps)
    .filter((time) => data.nodes.some((d) => contains(d, time)));

  const nodes = data.nodes.filter((d) => contains(d, 0));
  // const links1 = data.links.filter((d) => contains(d, 0));
  const links = data.links.filter((d) => contains(d, 0)).filter((d) => d.source !== d.target);

  chart.update({ nodes, links }, 0);

  // BUTTON STUFF
  let isPlaying = false

  d3.select(playButton).on("click", function () {
    isPlaying = !isPlaying;

    if (isPlaying) {
        d3.select(this).text('Pause');

        const timestampParam = getURLParameter("timestamp");
        const URL_timestep = timestampParam ? parseInt(timestampParam) : 0;

        // let i = 0;
        let i = URL_timestep;
        let timeout;

        function doUpdate() {
            if (i >= times.length) {
                i = 0;
            }

            update(times[i++]);

            if (isPlaying) {
                const timeout = setTimeout(doUpdate, 1000);
            }
        }

        doUpdate();
    } else {
        d3.select(this).text("Play");
        clearTimeout(timeout); // Clear the timeout when pausing
    }
  });

  // rendering the initial visual 
  // update(0)


}

