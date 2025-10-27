import renderPlot from "./components/plot"
import { initPoincareGl, initTrajectoryGl} from "./webgl/webGlUtils"
import initClick from "./interactive/click"
import initZoom from "./interactive/zoom"
import initSlider from "./components/slider"

renderPlot();

const {drawPoincare, updatePoints, finalizePoints, clearPoints} = initPoincareGl();

const {drawTrajectory, updateTrajectory, clearTrajectory} = initTrajectoryGl();

const initWorker = initClick(drawPoincare, updatePoints, finalizePoints, drawTrajectory, updateTrajectory, clearTrajectory)
initZoom(drawPoincare, drawTrajectory)
initSlider(renderPlot, initWorker, clearPoints, clearTrajectory)