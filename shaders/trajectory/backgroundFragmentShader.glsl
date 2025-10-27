#version 300 es
precision lowp float;

in vec2 v_uv;
uniform float u_energy;
uniform float u_x;

out vec4 outColor;

void main(){
    float x = v_uv.x;
    float y = v_uv.y;
    float E = u_energy;
    float hamiltonian = (pow(x, 2.0)+pow(y, 2.0))/2.0+pow(x,2.0)*y-pow(y,3.0)/3.0;
    if (E > hamiltonian){
        outColor = vec4(0.1 ,0.1, 0.1, 1.0);
    } else {
        outColor = vec4(0.5, 0.5, 0.5, 1.0);
    }
}