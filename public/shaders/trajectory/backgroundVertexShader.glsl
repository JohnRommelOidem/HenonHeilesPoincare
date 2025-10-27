#version 300 es
precision lowp float;

out vec2 v_uv;
uniform mat3 u_transform;
void main(){
    const vec2 positions[4] = vec2[4](
        vec2(-1.0, -1.0),
        vec2(1.0, -1.0),
        vec2(-1.0, 1.0),
        vec2(1.0, 1.0)
    );
    gl_Position = vec4(positions[gl_VertexID], 0.0, 1.0);
    v_uv = (inverse(u_transform)*vec3(positions[gl_VertexID], 1.0)).xy;
}