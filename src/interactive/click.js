
import {setQP, isPossible, xRangeYvalue} from "./integrator"
import { pointer } from "d3";
import state from "./state";

const T = 100000
const dt = 0.001
export default function initClick(drawPoincare, updatePoints, finalizePoints, drawTrajectory, updateTrajectory, clearTrajectory){
    function initPoincareWorker(y, py){
        if (state.poincareWorker != null){
            state.poincareWorker.terminate();
            state.poincareWorker = null;
        }
        if (state.trajectoryWorker != null){
            state.trajectoryWorker.terminate();
            state.trajectoryWorker = null;
        }
        state.poincareWorker = new Worker(
            new URL("./poincareWorker.js", import.meta.url),
            { type: "module" }
        );
        state.trajectoryWorker = new Worker(
            new URL("./trajectoryWorker.js", import.meta.url),
            { type: "module" }
        );
        state.poincareWorker.onmessage = function(e){
            if (e.data.done) return;
            const [y, py] = e.data;
            updatePoints([py, y]);
            drawPoincare(state.transform);
        }
        state.trajectoryWorker.onmessage = function(e){
            if (e.data.done) return;
            const points = e.data;
            drawTrajectory(state.trajTransform);
            updateTrajectory(points);
        }
        updatePoints([py, y]);
        drawPoincare(state.transform)
        const qp = setQP(y, py, state);
        state.poincareWorker.postMessage({qp, dt, T, x:state.x})
        state.trajectoryWorker.postMessage({qp, dt:dt*100, T:T/50, x:state.x})
    }
    state.poincareCanvas.on("click",function(e){
            const [x,y] = state.transform.invert(pointer(e, this));
            const pyi = state.scales.pyScale.invert(x);
            const yi = state.scales.yScale.invert(y);
            if (isPossible(state, yi, pyi)){
                finalizePoints();
                clearTrajectory();
                initPoincareWorker(yi, pyi);
            }
        }).on("dblclick", e=>e.preventDefault())

    initPoincareWorker(xRangeYvalue(state), 0);
    return initPoincareWorker;
}