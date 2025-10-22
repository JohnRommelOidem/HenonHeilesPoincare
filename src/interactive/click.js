
import {setQP, isPossible} from "./integrator"
import { pointer } from "d3";
import state from "./state";

const T = 100000
const dt = 0.001

export default function initClick(drawScene, updatePoints, finalizeTrajectory){
    function initPoincareWorker(y, py){
        if (state.poincareWorker != null){
            state.poincareWorker.terminate();
            state.poincareWorker = null;
        }
        const worker = new Worker(
            new URL("./worker.js", import.meta.url),
            { type: "module" }
        );
        worker.onmessage = function(e){
            if (e.data.done) return;
            const [[x, y], [px, py]] = e.data;
            updatePoints([state.xScale(y), state.yScale(py)]);
            drawScene(state.transform)
        }
        updatePoints([state.xScale(y), state.yScale(py)]);
        drawScene(state.transform)
        const qp = setQP(y, py, state);
        worker.postMessage({qp, dt, T, x:state.x})
        state.poincareWorker = worker
    }
    state.canvas.on("click",function(e){
            const [x,y] = state.transform.invert(pointer(e, this));
            const pyi = state.yScale.invert(y);
            const yi = state.xScale.invert(x);
            if (isPossible(state, yi, pyi)){
                finalizeTrajectory();
                initPoincareWorker(yi, pyi);
            }
        }).on("dblclick", e=>e.preventDefault())

    initPoincareWorker(0, 0);
    return initPoincareWorker;
}