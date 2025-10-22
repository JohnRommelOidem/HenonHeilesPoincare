import * as d3 from "d3";
import state from "./state";

const axes = d3.select("#axes");

export default function initZoom(drawScene){
    const zoom = d3.zoom()
        .scaleExtent([1, 100])
        .translateExtent([[0, 0], [state.innerWidth, state.innerHeight]])
        .on("zoom", (e) => {
            const newX = e.transform.rescaleX(state.xScale);
            const newY = e.transform.rescaleY(state.yScale);
            axes.select(".axis-x").call(state.axesParts.x.scale(newX));
            axes.select(".axis-y").call(state.axesParts.y.scale(newY));
            axes.select(".axis-x-sub").call(state.axesParts.xSub.scale(newX));
            axes.select(".axis-y-sub").call(state.axesParts.ySub.scale(newY));
            state.transform = e.transform;
            drawScene(state.transform);
        });
    state.canvas.call(zoom).on("dblclick.zoom", null).on("dblclick", (e) => e.preventDefault());;
}