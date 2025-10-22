import renderPlot from "./components/plot"
import initGl from "./webgl/webGlUtils"
import initClick from "./interactive/click"
import initZoom from "./interactive/zoom"
import initSlider from "./components/slider"

renderPlot();

const {drawScene, updatePoints, finalizeTrajectory, clearPoints} = initGl()

const initPoincareWorker = initClick(drawScene, updatePoints, finalizeTrajectory)
initZoom(drawScene)
initSlider(renderPlot, initPoincareWorker, clearPoints)