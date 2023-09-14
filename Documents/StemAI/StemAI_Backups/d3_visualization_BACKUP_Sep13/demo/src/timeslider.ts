import {select} from 'd3'
// import { getURLParameter } from './preRenderNetwork'

// const setupSlider = (id: string) => {
//     // console.log("setting up slider")
//     select(id)
//         .attr("value", "0") // Set the initial value to the leftmost position (minimum value)        
//         // .attr("value", getURLParameter('timestamp'))
//         .on("change", (d) => {
//             console.log(d.target.value)
//             console.log("TIMESLIDER HELLO!")
//             window.location.href = `/?timestamp=${d.target.value}`;

//         })
// }

// export {setupSlider}


// const setupSlider = (id: string) => {
//     // Get the timestamp value from the URL query parameter
//     const urlParams = new URLSearchParams(window.location.search);
//     const timestampParam = urlParams.get('timestamp');
//     const initialValue = timestampParam ? parseInt(timestampParam, 10) : 0; // Parse the value as an integer

//     // Select the slider element
//     const slider = select(id);

//     // Set the initial value of the slider
//     slider.attr("value", initialValue);

//     // Event handler for slider changes
//     slider.on("change", (d) => {
//         const newValue = d.target.value;
//         console.log(newValue);
//         // Update the URL with the new timestamp value
//         window.history.replaceState({}, "", `/?timestamp=${newValue}`);
//     });
// }

// export { setupSlider }

const setupSlider = (id: string) => {
    // Get the timestamp value from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const timestampParam = urlParams.get('timestamp');
    const initialValue = timestampParam ? parseInt(timestampParam, 10) : 0; // Parse the value as an integer

    // Select the slider element
    const slider = select(id);

    // Set the initial value of the slider
    slider.attr("value", initialValue);

    // Event handler for slider changes
    slider.on("change", (d) => {
        const newValue = d.target.value;
        console.log(newValue);
        // Update the URL with the new timestamp value
        window.history.replaceState({}, "", `/?timestamp=${newValue}`);
    });

    // Select the refresh button element
    const refreshButton = document.getElementById("refresh-button");

    // Check if the refresh button element was found
    if (refreshButton) {
        // Event handler for the refresh button click
        refreshButton.addEventListener("click", () => {
            // Reset the slider value to 0
            slider.attr("value", 0);
            // Update the URL with timestamp=0
            window.history.replaceState({}, "", "/?timestamp=0");
        });
    }
}

export { setupSlider }
