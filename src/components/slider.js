import state from "../interactive/state"

const sliderContent = document.getElementById("slider-container")
export default function initSlider(renderPlot, initPoincareWorker, clearPoints){
    function createSlider(sliderDetails){
        const slider = document.createElement("input");
        slider.type = "range"
        slider.min = sliderDetails.min;
        slider.max = sliderDetails.max;
        slider.step = sliderDetails.step;
        slider.value = state[sliderDetails.id];
        slider.id = sliderDetails.id
        
        const label = document.createElement("label");
        label.htmlFor = slider.id;
        label.textContent = sliderDetails.name + parseFloat(Number(slider.value).toFixed(3));
        label.id = slider.id+"-label";
        slider.addEventListener("input", (e)=>{
            const sliderValue = e.target.value
            state[sliderDetails.id] = parseFloat(sliderValue);
            label.textContent = sliderDetails.name + parseFloat(Number(slider.value).toFixed(3))
            state.transform = {x:0, y:0, k:1, invert:function(location){return [(location[0]-this.x)/this.k, (location[1]-this.y)/this.k]}};

            if (sliderDetails.id === "energy"){
                const xLabel = document.getElementById("x-label")
                const xSlider = document.getElementById("x")
                const xBound = Math.sqrt(2*state.energy)
                xSlider.min = -Math.ceil(xBound*1e3)*1e-3
                xSlider.max = Math.floor(xBound*1e3)*1e-3
                xSlider.value = Math.min(xSlider.max, Math.max(xSlider.min, xSlider.value))
                xLabel.textContent = "Section: x=" + parseFloat(Number(xSlider.value).toFixed(3))
                state.x = Number(xSlider.value);
            }

            renderPlot();
            initPoincareWorker(0, 0);
            clearPoints();
        });
        const sliderGroup = document.createElement("div");
        sliderGroup.className = "slider-group";
        sliderGroup.append(label, slider);
        sliderContent.append(sliderGroup)
    }
    createSlider({min:5e-3, max:1/6, step:1e-3, id:"energy", name:"Energy: "})
    createSlider({min:-Math.sqrt(2*state.energy), max:Math.sqrt(2*state.energy), step:1e-3, id:"x", name:"Section: x="})
}