import {stormerVerlet} from "./integrator"
self.onmessage = function(e){
    let {qp, dt, T, x} = e.data;
    let oldQP = qp;
    for (let t = 0; t<T; t+=dt){
        qp = stormerVerlet(qp, dt);
        if ((qp[0][0]-x)*(oldQP[0][0]-x)<0&&qp[1][0]>0){
            self.postMessage(qp);
        }
        oldQP = qp
    }
    self.postMessage({done:true});
}