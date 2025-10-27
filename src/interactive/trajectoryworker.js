import {stormerVerlet} from "./integrator"
self.onmessage = function(e){
    let {qp, dt, T} = e.data;
    let points = [];
    const chunkSize = T/dt/5;
    console.log(chunkSize)
    for (let t = 0; t<T; t+=dt){
        qp = stormerVerlet(qp, dt);
        points.push(qp[0][0], qp[0][1]);
        if (points.length>=chunkSize){
            self.postMessage(points);
            points = []; 
        }
    }
    
    self.postMessage({done:true});
}