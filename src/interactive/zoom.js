import * as d3 from "d3";
import state from "./state";

const poincareAxes = d3.select("#poincare-axes");
const trajectoryAxes = d3.select("#trajectory-axes");

export default function initZoom(drawScene, drawTrajectory){
    const poincareZoom = d3.zoom()
        .scaleExtent([1, 100])
        .translateExtent([[0, 0], [state.innerWidth, state.innerHeight]])
        .on("zoom", (e) => {
            const newX = e.transform.rescaleX(state.scales.pyScale);
            const newY = e.transform.rescaleY(state.scales.yScale);
            poincareAxes.select(".axis-y").call(state.axesParts.y.scale(newY));
            poincareAxes.select(".axis-py").call(state.axesParts.py.scale(newX));
            poincareAxes.select(".axis-y-sub").call(state.axesParts.ySub.scale(newY));
            poincareAxes.select(".axis-py-sub").call(state.axesParts.pySub.scale(newX));
            state.transform = e.transform;
            drawScene(state.transform);
        });
    state.poincareCanvas.call(poincareZoom).on("dblclick.zoom", null).on("dblclick", (e) => e.preventDefault());
    
    const trajectoryZoom = d3.zoom()
        .scaleExtent([1, 100])
        .translateExtent([[0, 0], [state.innerWidth, state.innerHeight]])
        .on("zoom", (e) => {
            const newX = e.transform.rescaleX(state.scales.trajXScale);
            const newY = e.transform.rescaleY(state.scales.trajYScale);
            trajectoryAxes.select(".axis-x").call(state.trajAxesParts.x.scale(newX));
            trajectoryAxes.select(".axis-y").call(state.trajAxesParts.y.scale(newY));
            trajectoryAxes.select(".axis-x-sub").call(state.trajAxesParts.xSub.scale(newX));
            trajectoryAxes.select(".axis-y-sub").call(state.trajAxesParts.ySub.scale(newY));
            state.trajTransform = e.transform;
            drawTrajectory(state.trajTransform);
        });
    state.trajectoryCanvas.call(trajectoryZoom).on("dblclick.zoom", null).on("dblclick", (e) => e.preventDefault());
}