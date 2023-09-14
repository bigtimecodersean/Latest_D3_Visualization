//@ts-nocheck
import './style.css'
import { setupNetwork } from './preRenderNetwork.js'

import { setupLegend } from './legend.ts'

// import { RenderGraph, setupPostRenderNetwork } from './postRenderNetwork.ts'
import input_data from './input.json'


import { setupSlider } from './timeslider.ts'
import { setupMessages } from './messages.ts'
import { setupNailed } from './nailed.ts'
import { setupNumCells } from './numCells.ts'
import { setupSeedCellSuffering } from './seedCellSuffering.ts'
import { setupSelfEfficacies } from './selfEfficacies.ts'
import { setupStemnesses } from './stemnesses.ts'
import { setupStresses } from './stresses.ts'
// import { setupNetworkLegend } from './networkLegend.ts'
// import { setupPlayButton } from './playButton.ts'

const max = input_data.max_timestamps - 1

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="container">
    <h1>StemAI Visualization </h1>
    <div class="charts">
      <div id="prerender_chart1"></div>
      <svg id="prerender_chart" width="680" height="680" />
      <div id="legend"></div>
      
    </div>
    
    <div class="buttonsAndSliders">
      <input type="range" id="timeslider" name="timeslider" min="0" max=${max}>
      <button id="play">Play</button>
      <p>Current Timestep <span id="currentTimestampLabel"> 0 </span><p>
    </div>

    <div class="chartsContainers">
      <div id="messages"></div>
      <div id="nailed"></div>
      <div id="stresses"></div>
      <div id="seedCellSuffering"></div>
      <div id="selfEfficacies"></div>
      <div id="stemnesses"></div>
      <div id="numCells"></div>
    
    </div>

  </div>
`
setupNetwork("#play")
// setupNetwork('#prerender_chart', "#play", max)
setupLegend('#legend')
// setupNetworkLegend("#networklegendTim")
setupSlider("#timeslider")
setupMessages()
setupNailed("#nailed")
setupNumCells("#numCells")
setupSeedCellSuffering("#seedCellSuffering")
setupSelfEfficacies("#selfEfficacies")
setupStemnesses("#stemnesses")
setupStresses("#stresses")
// setupPlayButton("#play", max)
