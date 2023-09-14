import Graph from 'graphology';
import {density} from 'graphology-metrics/graph/density';
import {bidirectional} from 'graphology-shortest-path';


export function calculateNetworkStatistics(nodes: any, links: any){

    // // DO NETWORK STATISTICS HERE 
  
    const new_graph = new Graph();
  
    for (let node of nodes) {
        new_graph.addNode(node.id);
      }
      
    
    for (let link of links) {
      

        new_graph.addEdge((link.source.id), link.target.id);
      }
  

    const d = density(new_graph);
  
    // Average Path Length 
  
    function averagePathLength(new_graph: any) {
        let totalPathLength = 0;
        let numPairs = 0;
      
        for (const sourceNode of new_graph.nodes()) {
          for (const targetNode of new_graph.nodes()) {
            if (sourceNode !== targetNode) {
              const path = bidirectional(new_graph, sourceNode, targetNode);
              if (path !== null) {
                totalPathLength += path.length - 1;
                numPairs++;
              }
            }
          }
        }

      
        return totalPathLength / numPairs;
      }
      
      const avgPathLength = averagePathLength(new_graph);
  
    // Clustering Coefficient (of whole graph)
  
    // Calculate the clustering coefficient for a specific node
        function nodeClusteringCoefficient(new_graph: any, node: any) {
        const neighbors = new_graph.neighbors(node);
        const numNeighbors = neighbors.length;
  
        if (numNeighbors < 2) {
            return 0;
        }
  
        let numTriangles = 0;
  
        for (let i = 0; i < numNeighbors; i++) {
            for (let j = i + 1; j < numNeighbors; j++) {
            if (new_graph.hasEdge(neighbors[i], neighbors[j])) {
                numTriangles++;
            }
            }
        }
  
        const possibleTriangles = (numNeighbors * (numNeighbors - 1)) / 2;
        return numTriangles / possibleTriangles;
        }
  
        // Calculate the global clustering coefficient for the entire graph
        function globalClusteringCoefficient(new_graph: any) {
        const nodes = new_graph.nodes();
        const numNodes = nodes.length;
        let totalClusteringCoefficient = 0;
  
        for (const node of nodes) {
            totalClusteringCoefficient += nodeClusteringCoefficient(new_graph, node);
        }
  
        return totalClusteringCoefficient / numNodes;
        }
  
        const avgClusteringCoefficient = globalClusteringCoefficient(new_graph);
  
        // Global Efficiency 
  
        // Calculate the shortest path length between two nodes
        function shortestPathLength(new_graph: any, sourceNode: any, targetNode: any) {
            const path = bidirectional(new_graph, sourceNode, targetNode);
            return path ? path.length - 1 : Infinity;
        }
        
        // Calculate the global efficiency of the graph
        function globalEfficiency(new_graph: any) {
            let totalEfficiency = 0;
            let numPairs = 0;
        
            for (const sourceNode of new_graph.nodes()) {
            for (const targetNode of new_graph.nodes()) {
                if (sourceNode !== targetNode) {
                const pathLength = shortestPathLength(new_graph, sourceNode, targetNode);
                totalEfficiency += 1 / pathLength;
                numPairs++;
                }
            }
            }
        
            return totalEfficiency / numPairs;
        }
        
        const efficiency = globalEfficiency(new_graph);
  
        // Graph Centralization 
  
        // Calculate the degree centralization of the graph
        function degreeCentralization(new_graph: any) {
            const nodes = new_graph.nodes();
            const maxDegree = nodes.reduce((max: any, node: any) => {
            const degree = new_graph.degree(node);
            return degree > max ? degree : max;
            }, 0);
        
            let totalDifference = 0;
        
            for (const node of nodes) {
            const degree = new_graph.degree(node);
            totalDifference += maxDegree - degree;
            }
        
            const normalizedDifference = totalDifference / ((nodes.length - 1) * (nodes.length - 2));
            return normalizedDifference;
        }
        
        const centralization = degreeCentralization(new_graph);

        return {
            avgPathLength,
            avgClusteringCoefficient,
            efficiency,
            centralization
        };
  
    // select(".legendAvgPathLength").text(`Average Path Length: ${avgPathLength}`) 
    // select(".legendGlobalClusteringCoefficient").text(`Global Clustering Coefficient: ${avgClusteringCoefficient}`)
    // select(".legendGlobalEfficiency").text(`Global Efficiency: ${efficiency}`)
    // select(".legendDegreeCentralization").text(`Degree Centralization: ${centralization}`) 
  }