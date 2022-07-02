export const vertexShader = `
uniform mat4 projection;
uniform mat4 bunnyMatrix;
uniform mat4 mMatrix;
varying vec3 vNormal;
varying vec3 VPosition;

void main() {

    vec4 worldPosition = mMatrix * vec4(position, 1.0);
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
    vec2 pix = gl_FragCoord.xy / uResolution - vec2(0.5);
    vec3 sunDirection = normalize(vec3(vec2(pix.x, -pix.y), -1.0));

    vec3 finalColor = getSkyColor(sunDirection ,cameraPos) + vNormal;

    gl_FragColor = vec4(finalColor, 1.0);

}
`;
