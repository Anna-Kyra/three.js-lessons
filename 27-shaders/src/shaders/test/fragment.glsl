precision mediump float;

uniform vec3 uColor;
uniform sampler2D uTexture;

varying vec2 vUv;

void main() {
    vec4 textureColor = texture2D(uTexture, vUv); //vec4 omdat je ook transparante afbeeldingen kan gebruiken
    gl_FragColor = textureColor;
}