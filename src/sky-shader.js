export const vertexShader = `
uniform mat4 projection;
uniform mat4 mMatrix;

varying vec4 worldPosition;

void main() {
    worldPosition = mMatrix * vec4(position, 1.0);
    gl_Position = projection * worldPosition;

}

`;
export const fragmentShader = `
precision highp float;
uniform vec4 sunPos;
uniform vec2 uResolution;
uniform vec3 cameraPos;
uniform vec4 sunColor;
varying vec4 worldPosition;

// 直线跟球求交点
void isPhere (in vec3 origin, in vec3 direction, in vec4 sphere , inout float t){
    // 球 x^2 + y^2 + z^2 = r^2;
    // 光线  p = p0 + td;
    // (p0x + tdx - sunx)^2 + (p0y + tdy - suny)^2 + (p0z + tdz - sunz)^2 = r^2;
    // At^2 + Bt + C = 0
    vec3 spherePos = sphere.xyz;
    float A = 1.0;
    float B = 2.0 * dot(origin - spherePos, direction);
    float C = dot(origin - spherePos, origin - spherePos) - sphere.w * sphere.w;

    // 2元一次方程 判别式
    float disc = B * B - 4.0 * A *C;
    // 天空颜色
    vec3 skyColor = vec3(0.0, 0.2, 0.35);
    if(disc < 0.0)
        // 返回天空的颜色
        return;
    t = (-B - sqrt(disc)) / (2.0 * A);
}

vec3 getSkyColor (vec3 sunDirection, vec3 p0){
    float t = -1.0;

    isPhere(p0, sunDirection, sunPos , t);
    
    // 天空颜色
    vec3 skyColor = vec3(0.0, 0.2, 0.55);
    // 地面颜色
    vec3 groundColor = vec3(0.0, 0.0, 0.0);
    // 天空的角度
    vec3 direction = normalize(worldPosition.xyz);
    float a = dot(direction, vec3(0.0, 1.0, 0.0));
    
    vec3 backgroundColor = mix(skyColor , groundColor , a);
    if(t < 0.0){
        return backgroundColor;
    }

    // 离相机较近的交点
    vec3 p = p0 + t * sunDirection;
    vec3 n = normalize(p - sunPos.xyz);
   
    // 太阳方向跟当前顶点方向的夹角
    float sunTheta  = max(dot(-n, sunDirection), 0.0);
    // 太阳底色
    vec3 sunColor = sunColor.xyz * max(sunTheta - 0.7, 0.0) * 5.0;
    // 光晕
    vec3 sunAtmosphere = max(sunColor - backgroundColor, vec3(0.0)) * max(sunTheta - 0.96, 0.0) * 20.0;
    sunAtmosphere = sunAtmosphere * sunAtmosphere * 20.0 * vec3(2.0, 1.5, 0.4);
    
    return backgroundColor + sunColor + sunAtmosphere;
}

void main() {
    vec2 pix = gl_FragCoord.xy / uResolution - vec2(0.5);
    vec3 sunDirection = normalize(vec3(vec2(pix.x, -pix.y), -1.0));

    vec3 finalColor = getSkyColor(sunDirection ,cameraPos);

    gl_FragColor = vec4(finalColor, 1.0);

}
`;
