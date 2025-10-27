import {stormerVerlet} from "./integrator"
self.onmessage = function(e){
    const chunkSize = 100000;
    let {qp, dt, T, x} = e.data;
    let points = [];
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