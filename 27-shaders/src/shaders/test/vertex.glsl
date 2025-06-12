uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

attribute vec3 position;

void main() {
    vec3 foo = vec3(1.0, 2.0, 3.0)
    vec2 bar = foo.xy


    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}