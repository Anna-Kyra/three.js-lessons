precision mediump float;

uniform vec3 uColor;
uniform sampler2D uTexture;

varying vec2 vUv;
varying float vElevation;

void main() {
    vec4 textureColor = texture2D(uTexture, vUv); //vec4 omdat je ook transparante afbeeldingen kan gebruiken
    textureColor.rgb *= vElevation * 2.0 + 0.6;
    gl_FragColor = textureColor;
}