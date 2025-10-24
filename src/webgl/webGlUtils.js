import state from '../interactive/state';

const vertexShaderSource = await fetch('./shaders/vertexShader.glsl').then(r => r.text());
const fragmentShaderSource = await fetch('./shaders/fragmentShader.glsl').then(r => r.text());

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

export default function initGl(canvas = state.canvas.node()){
    const gl = canvas.getContext("webgl2");
    
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    const program = createProgram(gl, vertexShader, fragmentShader);

    const positionLocation = gl.getAttribLocation(program, "a_position");

    const transformLocation = gl.getUniformLocation(program, "u_transform");
    const colorLocation = gl.getUniformLocation(program, "u_color");
    const sizeLocation = gl.getUniformLocation(program, "u_size");

    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionLocation);

    const poisitionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, poisitionBuffer);
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

    function finalizeTrajectory(){
        oldPositions.push(...positions)
        positions = []
    }

    function clearPoints(){
        positions = []
        oldPositions = []
    }

    function getTransformationMatrix(transform={k:1, x:0, y:0}, width = canvas.width, height = canvas.height){
        const {k, x, y} = transform
        return new Float32Array([
            2*k/width, 0, 0,
            0, -2*k/height, 0,
            -1+2*x/width, 1-2*y/height, 1
        ])
    }
    
    gl.viewport(0, 0, canvas.width, canvas.height);
    function drawScene(transform){
        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);

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
    return {drawScene, updatePoints, finalizeTrajectory, clearPoints};
}