export const vertexShader = `
uniform mat4 projection;
uniform mat4 mMatrix;

void main() {

    vec4 worldPosition = mMatrix * vec4(position, 1.0);
    gl_Position = projection * worldPosition;
}

`;
export const fragmentShader = `
precision highp float;
uniform vec4 sunInfo;
uniform vec2 uResolution;

void main() {
    vec3 cameraPos = vec3(0.0, 0.0, 0.0);
    vec3 direction = normalize(vec3(gl_FragCoord.xy / uResolution -0.5, 1.0));

    gl_FragColor = vec4(0.4, 0.0, 0.0, 1.0);

}
`;
