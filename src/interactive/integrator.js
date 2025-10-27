const PI = Math.PI

function dV(q){
    const [x, y] = q;
    return [-x-2*x*y, -y-x**2+y**2]
}
export function getE(qp){
    const [[x,y], [px,py]] = qp
    return (px**2+py**2+x**2+y**2)/2+x**2*y-y**3/3
}

export function pyRange(state){
    const yMax = (1-Math.sqrt(1+4*state.x**2))/2
    const value = Math.sqrt(2*(state.energy+yMax**3/3-state.x**2*yMax)-state.x**2-yMax**2)
    return [-value, value]
}

export function yRange(state){
    return[
        Math.sqrt(4*state.x**2+1)*Math.cos((Math.acos((1-12*(state.energy-state.x**2))/(4*state.x**2+1)**(3/2))-4*PI)/3)+1/2,
        Math.sqrt(4*state.x**2+1)*Math.cos((Math.acos((1-12*(state.energy-state.x**2))/(4*state.x**2+1)**(3/2))-2*PI)/3)+1/2
    ]
}

export function totalYRange(state){
    return[
        Math.cos((Math.acos(1-12*(state.energy))-4*PI)/3)+1/2,
        Math.cos((Math.acos(1-12*(state.energy))-2*PI)/3)+1/2
    ]
}

export function xRange(state){
    return[
        -Math.ceil(Math.sqrt(((2*Math.cos((Math.acos(-6*state.energy)+4*PI)/3)+1)**2-1)/4)*1000)/1000,
        Math.floor(Math.sqrt(((2*Math.cos((Math.acos(-6*state.energy)+4*PI)/3)+1)**2-1)/4)*1000)/1000
    ]
}

export function xRangeYvalue(state){
    return -Math.cos((Math.acos(-6*state.energy)+4*PI)/3)
}

export function setPx(x, y, py, E){
    return Math.sqrt(2*(E-x**2*y+y**3/3)-py**2-x**2-y**2)
}

export function isPossible(state, y, py){
    return state.energy> (py**2+y**2+state.x**2)/2+state.x**2*y-y**3/3
}
export function stormerVerlet(qp, dt){
    let [qOld, pOld] = qp;
    let q = [...qOld];
    let p = [...pOld];
    const dV0 = dV(q);
    for (let i=0;i<2;i++){
        p[i] += dt*dV0[i]/2;
    }
    for (let i=0;i<2;i++){
        q[i] += dt*p[i];
    }
    const dV1 = dV(q)
    for (let i=0;i<2;i++){
        p[i] += dt*dV1[i]/2;
    }
    return [q, p]
}

export function setQP(y, py, state){
    return[
        [state.x, y],
        [setPx(state.x, y, py, state.energy), py]
    ]
}