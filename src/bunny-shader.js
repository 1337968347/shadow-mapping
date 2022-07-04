export const vertexShader = `
uniform mat4 projection;
uniform mat4 bunnyMatrix;
varying vec3 vNormal;
varying vec3 VPosition;

void main() {

    vec4 worldPosition = bunnyMatrix * vec4(position, 1.0);
    gl_Position = projection * worldPosition;
    VPosition = vec3(worldPosition.xyz);
    vNormal = normalize((bunnyMatrix * vec4(normal, 1.0) ).xyz);
}

`;
export const fragmentShader = `
precision highp float;
uniform vec4 sunPos;
uniform vec3 cameraPos;
uniform vec4 sunColor;
varying vec3 vNormal;
varying vec3 VPosition;


void main() {
    vec3 finalColor = vNormal;

    gl_FragColor = vec4(finalColor, 1.0);

}
`;
