import state from '../interactive/state';

const vertexShaderSource = await fetch('./shaders/poincare/vertexShader.glsl').then(r => r.text());
const fragmentShaderSource = await fetch('./shaders/poincare/fragmentShader.glsl').then(r => r.text());

const backgroundVertexShaderSource = await fetch('./shaders/poincare/backgroundVertexShader.glsl').then(r => r.text());
const backgroundFragmentShaderSource = await fetch('./shaders/poincare/backgroundFragmentShader.glsl').then(r => r.text());

const trajectoryVertexShaderSource = await fetch('./shaders/trajectory/vertexShader.glsl').then(r => r.text());
const trajectoryFragmentShaderSource = await fetch('./shaders/trajectory/fragmentShader.glsl').then(r => r.text());

const trajectoryBackgroundVertexShaderSource = await fetch('./shaders/trajectory/backgroundVertexShader.glsl').then(r => r.text());
const trajectoryBackgroundFragmentShaderSource = await fetch('./shaders/trajectory/backgroundFragmentShader.glsl').then(r => r.text());

function createShader(gl, type, source){
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        return shader;
    }
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader){
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (gl.getProgramParameter(program, gl.LINK_STATUS)){
        return program;
    }
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

export function initPoincareGl(canvas = state.poincareCanvas.node()){
    const gl = canvas.getContext("webgl2");
    
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    const program = createProgram(gl, vertexShader, fragmentShader);
    
    const backgroundVertexShader = createShader(gl, gl.VERTEX_SHADER, backgroundVertexShaderSource);
    const backgroundFragmentShader = createShader(gl, gl.FRAGMENT_SHADER, backgroundFragmentShaderSource);
    
    
    const positionLocation = gl.getAttribLocation(program, "a_position");
    const transformLocation = gl.getUniformLocation(program, "u_transform");
    const colorLocation = gl.getUniformLocation(program, "u_color");
    const sizeLocation = gl.getUniformLocation(program, "u_size");
    
    const backgroundProgram = createProgram(gl, backgroundVertexShader, backgroundFragmentShader);
    const backgroundTransformLocation = gl.getUniformLocation(backgroundProgram, "u_transform");
    const xLocation = gl.getUniformLocation(backgroundProgram, "u_x");
    const energyLocation = gl.getUniformLocation(backgroundProgram, "u_energy");

    const backgroundVao = gl.createVertexArray();
    gl.bindVertexArray(backgroundVao);
    
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionLocation);

    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(
        positionLocation,
        2,
        gl.FLOAT,
        false,
        0,
        0
    );

    let positions = []
    let oldPositions = []

    function updatePoints(newPoint){
        return positions.push(...newPoint);
    }

    function finalizePoints(){
        oldPositions.push(...positions)
        positions = []
    }

    function clearPoints(){
        positions = []
        oldPositions = []
    }

    function getTransformationMatrix(transform={k:1, x:0, y:0}, width = canvas.width, height = canvas.height, xDomain = state.scales.pyScale.domain(), yDomain = state.scales.yScale.domain()){
        const {k, x, y} = transform
        const [xMin, xMax] = xDomain
        const [yMin, yMax] = yDomain
        const xRange = xMax-xMin
        const yRange = yMax-yMin
        return new Float32Array([
            2*k/xRange, 0, 0,
            0, 2*k/yRange, 0,
            -2*k*xMin/xRange+2*x/width-1, -2*k*yMax/yRange+1-2*y/height, 1
        ])
    }
    
    gl.viewport(0, 0, canvas.width, canvas.height);
    function drawPoincare(transform){
        gl.useProgram(backgroundProgram);
        gl.bindVertexArray(backgroundVao);
        gl.uniform1f(energyLocation, state.energy);
        gl.uniform1f(xLocation, state.x);
        gl.uniformMatrix3fv(backgroundTransformLocation, false, getTransformationMatrix(transform));
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.useProgram(program);
        gl.bindVertexArray(vao);

        gl.uniform1f(sizeLocation, 1.5)
        gl.uniform4fv(colorLocation, [1,1,1,1]);
        gl.uniformMatrix3fv(transformLocation, false, getTransformationMatrix(transform));
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(oldPositions), gl.DYNAMIC_DRAW);
        gl.drawArrays(gl.POINTS, 0, oldPositions.length/2);

        gl.uniform1f(sizeLocation, 2.5)
        gl.uniform4fv(colorLocation, [0,0.7,1,1]);
        gl.uniformMatrix3fv(transformLocation, false, getTransformationMatrix(transform));
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.DYNAMIC_DRAW);
        gl.drawArrays(gl.POINTS, 0, positions.length/2);
    }
    return {drawPoincare, updatePoints, finalizePoints, clearPoints};
}
export function initTrajectoryGl(canvas = state.trajectoryCanvas.node()){
    const gl = canvas.getContext("webgl2");
    
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, trajectoryVertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, trajectoryFragmentShaderSource);
    
    const program = createProgram(gl, vertexShader, fragmentShader);
    
    const backgroundVertexShader = createShader(gl, gl.VERTEX_SHADER, trajectoryBackgroundVertexShaderSource);
    const backgroundFragmentShader = createShader(gl, gl.FRAGMENT_SHADER, trajectoryBackgroundFragmentShaderSource);
    
    
    const positionLocation = gl.getAttribLocation(program, "a_position");
    const transformLocation = gl.getUniformLocation(program, "u_transform");
    const colorLocation = gl.getUniformLocation(program, "u_color");
    
    const backgroundProgram = createProgram(gl, backgroundVertexShader, backgroundFragmentShader);
    const backgroundTransformLocation = gl.getUniformLocation(backgroundProgram, "u_transform");
    const xLocation = gl.getUniformLocation(backgroundProgram, "u_x");
    const energyLocation = gl.getUniformLocation(backgroundProgram, "u_energy");

    const backgroundVao = gl.createVertexArray();
    gl.bindVertexArray(backgroundVao);
    
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionLocation);

    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(
        positionLocation,
        2,
        gl.FLOAT,
        false,
        0,
        0
    );

    let positions = []

    function updateTrajectory(newPoint){
        return positions.push(...newPoint);
    }

    function clearTrajectory(){
        positions = []
    }

    function getTransformationMatrix(transform={k:1, x:0, y:0}, width = canvas.width, height = canvas.height, xDomain = state.scales.trajXScale.domain(), yDomain = state.scales.trajYScale.domain()){
        const {k, x, y} = transform
        const [xMin, xMax] = xDomain
        const [yMin, yMax] = yDomain
        const xRange = xMax-xMin
        const yRange = yMax-yMin
        return new Float32Array([
            2*k/xRange, 0, 0,
            0, 2*k/yRange, 0,
            -2*k*xMin/xRange+2*x/width-1, -2*k*yMax/yRange+1-2*y/height, 1
        ])
    }
    
    gl.viewport(0, 0, canvas.width, canvas.height);
    function drawTrajectory(transform){
        gl.useProgram(backgroundProgram);
        gl.bindVertexArray(backgroundVao);
        gl.uniform1f(energyLocation, state.energy);
        gl.uniform1f(xLocation, state.x);
        gl.uniformMatrix3fv(backgroundTransformLocation, false, getTransformationMatrix(transform));
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.useProgram(program);
        gl.bindVertexArray(vao);

        gl.uniform4fv(colorLocation, [0,0.7,1,1]);
        gl.uniformMatrix3fv(transformLocation, false, getTransformationMatrix(transform));
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.DYNAMIC_DRAW);
        gl.drawArrays(gl.LINE_STRIP, 0, positions.length/2);

        const [yMin, yMax] = state.scales.yScale.domain()

        gl.enableVertexAttribArray(positionLocation);
        gl.uniform4fv(colorLocation, [1,0,0,1]);
        gl.uniformMatrix3fv(transformLocation, false, getTransformationMatrix(transform));
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([state.x, yMin, state.x, yMax]), gl.DYNAMIC_DRAW);
        gl.drawArrays(gl.LINES, 0, 2);
    }
    drawTrajectory(state.trajTransform);
    return {drawTrajectory, updateTrajectory, clearTrajectory};
}