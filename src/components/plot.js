import * as d3 from "d3";
import { yRange, pyRange, xRange, totalYRange } from "../interactive/integrator";
import state from "../interactive/state";

const padding = {
    left:70,
    right:10,
    bottom:70,
    top:10
}

export default function renderPlot(){
    const plot = document.getElementById("poincare-container");
    const {width, height} = plot.getBoundingClientRect();
    const poincareSvg = d3.select("#poincare-axes")
    poincareSvg.selectAll("*").remove();
    const poincareAxes = poincareSvg.append("g").attr("transform", `translate(${padding.left}, ${padding.top})`)

    const trajectorySvg = d3.select('#trajectory-axes')
    trajectorySvg.selectAll("*").remove();
    const trajectoryAxes = trajectorySvg.append("g").attr("transform", `translate(${padding.left}, ${padding.top})`)

    const innerWidth = width - padding.left - padding.right
    const innerHeight = height - padding.top - padding.bottom
    const scales = {
        pyScale: d3.scaleLinear().domain(pyRange(state)).range([0, innerWidth]),
        yScale: d3.scaleLinear().domain(yRange(state)).range([innerHeight, 0]),
        trajXScale: d3.scaleLinear().domain(xRange(state)).range([0, innerWidth]),
        trajYScale: d3.scaleLinear().domain(totalYRange(state)).range([innerHeight, 0])
    }
    const axesParts = {
        py: d3.axisBottom(scales.pyScale).ticks(4),
        y: d3.axisLeft(scales.yScale).ticks(4),
        pySub: d3.axisTop(scales.pyScale).ticks(4).tickFormat(""),
        ySub: d3.axisRight(scales.yScale).ticks(4).tickFormat("")
    }
    const trajAxesParts = {
        x: d3.axisBottom(scales.trajXScale).ticks(4),
        y: d3.axisLeft(scales.trajYScale).ticks(4),
        xSub: d3.axisTop(scales.trajXScale).ticks(4).tickFormat(""),
        ySub: d3.axisRight(scales.trajYScale).ticks(4).tickFormat("")
    }
    poincareAxes.append("g")
        .attr("class", "axis-y axis")
        .call(axesParts.y)
        .append("text")
        .attr("class", "axis-label")
        .attr("x", -padding.left*3/4)
        .attr("y", innerHeight/2)
        .attr("text-anchor", "middle")
        .text("y")
    poincareAxes.append("g")
        .attr("class", "axis-py axis")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(axesParts.py)
        .append("text")
        .attr("class", "axis-label")
        .attr("x", innerWidth/2)
        .attr("y", padding.bottom*3/4)
        .attr("text-anchor", "middle")
        .html('y&#775;')
    poincareAxes.append("g")
        .attr("class", "axis-y-sub axis")
        .call(axesParts.ySub)
        .attr("transform", `translate(${innerWidth},0)`)
    poincareAxes.append("g")
        .attr("class", "axis-py-sub axis")
        .call(axesParts.pySub)

    trajectoryAxes.append("g")
        .attr("class", "axis-x axis")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(trajAxesParts.x)
        .append("text")
        .attr("x", innerWidth/2)
        .attr("y", padding.bottom*3/4)
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .text("x")
    trajectoryAxes.append("g")
        .attr("class", "axis-y axis")
        .call(trajAxesParts.y)
        .append("text")
        .attr("class", "axis-label")
        .attr("x", -padding.left*3/4)
        .attr("y", innerHeight/2)
        .attr("text-anchor", "middle")
        .html('y')
    trajectoryAxes.append("g")
        .attr("class", "axis-x-sub axis")
        .call(trajAxesParts.xSub)
    trajectoryAxes.append("g")
        .attr("class", "axis-y-sub axis")
        .attr("transform", `translate(${innerWidth},0)`)
        .call(trajAxesParts.ySub)

    d3.selectAll(".axis text").style("fill", "black");
    
    state.scales = scales;
    state.innerWidth = innerWidth;
    state.innerHeight = innerHeight;
    state.axesParts = axesParts;
    state.trajAxesParts = trajAxesParts;
    state.poincareCanvas = d3.select("#poincare-web-gl")
            .attr("width", innerWidth)
            .attr("height", innerHeight)
            .style("position", "absolute")
            .style("left", `${padding.left}px`)
            .style("top", `${padding.top}px`)
    state.trajectoryCanvas = d3.select("#trajectory-web-gl")
            .attr("width", innerWidth)
            .attr("height", innerHeight)
            .style("position", "absolute")
            .style("left", `${padding.left}px`)
            .style("top", `${padding.top}px`)
}