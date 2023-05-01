uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

uniform float uSize;
uniform float uTime;

attribute vec3 position;
attribute float aScale;
attribute vec3 color;
attribute vec3 aRandomness;

varying vec3 vColor;

void main(){
    vec4 modelPosition = modelMatrix * vec4(position,1.0);

    //animation
    // float angle = atan(modelPosition.x,modelPosition.z);
    // float distanceToCenter = length(modelPosition.xz);

    // modelPosition -= tan(distanceToCenter+ uTime);


    //spin
    float angle = atan(modelPosition.x,modelPosition.z);
    float distanceToCenter = length(modelPosition.xz);
    float offsetAngle = (1.0/distanceToCenter)* uTime;
    angle += offsetAngle;

    modelPosition.x = cos(angle) * distanceToCenter;
    modelPosition.z = sin(angle) * distanceToCenter;

    //randomness
    modelPosition.xyz += aRandomness.xyz;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    gl_PointSize =  uSize*(aScale * 10.0);
    gl_PointSize *= ( 1.0 / - viewPosition.z );

    vColor = color;
}