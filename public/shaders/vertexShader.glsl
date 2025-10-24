#version 300 es
precision highp float;

in vec2 a_position;
uniform mat3 u_transform;
uniform float u_size;

void main(){
    vec3 pos = u_transform*vec3(a_position, 1.0);
    gl_Position = vec4(pos.xy, 0.0, 1.0);
    gl_PointSize = u_size;
}