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

vec3 getSunColor (vec3 sunDirection, vec3 p0){
    // 球 x^2 + y^2 + z^2 = r^2;
    // 光线  p = p0 + td;
    // (p0x + tdx - sunx)^2 + (p0y + tdy - suny)^2 + (p0z + tdz - sunz)^2 = r^2;
    // At^2 + Bt + C = 0
    vec3 sunPos = sunInfo.xyz;
    float A = 1.0;
    float B = 2.0 * dot(p0 - sunPos, sunDirection);
    float C = dot(p0 - sunPos, p0 - sunPos) - sunInfo.w * sunInfo.w;

    float disc = B * B - 4.0 * A *C;

    if(disc < 0.0)
        return vec3(0.0,0.0,0.0);
    float t = (-B - sqrt(disc)) / (2.0 * A);
    // 离相机较近的交点
    vec3 p = p0 + t * sunDirection;
    vec3 n = normalize(p - sunPos);

    float diffuse  = max(0.0, dot(n, -sunDirection));

    return vec3(1.0 , 0.9, 0.9) * diffuse;
}

void main() {
    vec3 cameraPos = vec3(0.0, 0.0, 0.0);
    vec3 sunDirection = normalize(vec3(gl_FragCoord.xy / uResolution -0.5, -1.0));

    gl_FragColor = vec4(getSunColor(sunDirection ,cameraPos), 1.0);

}
`;
