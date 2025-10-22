import * as d3 from "d3";
import { yRange, pyRange } from "../interactive/integrator";
import state from "../interactive/state";

const padding = {
    left:70,
    right:20,
    bottom:70,
    top:20
}

function changeCanvasToSquare(){
    const plot = document.getElementById("plot-container");
    let { width, height } = plot.getBoundingClientRect();
    return {width, height}
}

export default function renderPlot(){
    const {width, height} = changeCanvasToSquare();
    const svg = d3.select("#axes")
        .attr("height", height)
        .attr("width", width)
    svg.selectAll("*").remove();
    const axes = svg.append("g").attr("transform", `translate(${padding.left}, ${padding.top})`)

    const innerWidth = width - padding.left - padding.right
    const innerHeight = height - padding.top - padding.bottom
    const scales = {
        xScale: d3.scaleLinear().domain(yRange(state)).range([0, innerWidth]),
        yScale: d3.scaleLinear().domain(pyRange(state)).range([innerHeight, 0])
    }
    const axesParts = {
        x: d3.axisBottom(scales.xScale).ticks(4),
        y: d3.axisLeft(scales.yScale).ticks(4),
        xSub: d3.axisTop(scales.xScale).ticks(4).tickFormat(""),
        ySub: d3.axisRight(scales.yScale).ticks(4).tickFormat("")
    }
    axes.append("g")
        .attr("class", "axis-x axis")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(axesParts.x)
        .append("text")
        .attr("x", innerWidth/2)
        .attr("y", padding.bottom*3/4)
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .text("y")
    axes.append("g")
        .attr("class", "axis-y axis")
        .call(axesParts.y)
        .append("text")
        .attr("class", "axis-label")
        .attr("x", -padding.left*3/4)
        .attr("y", innerHeight/2)
        .attr("text-anchor", "middle")
        .html('y&#775;')
    axes.append("g")
        .attr("class", "axis-x-sub axis")
        .call(axesParts.xSub)
    axes.append("g")
        .attr("class", "axis-y-sub axis")
        .attr("transform", `translate(${innerWidth},0)`)
        .call(axesParts.ySub)
    d3.selectAll(".axis text").style("fill", "black");
    
    state.xScale = scales.xScale;
    state.yScale = scales.yScale;
    state.innerWidth = innerWidth;
    state.innerHeight = innerHeight;
    state.axesParts = axesParts;
    state.canvas = d3.select("#web-gl")
            .attr("width", innerWidth)
            .attr("height", innerHeight)
            .style("position", "absolute")
            .style("left", `${padding.left}px`)
            .style("top", `${padding.top}px`)
}