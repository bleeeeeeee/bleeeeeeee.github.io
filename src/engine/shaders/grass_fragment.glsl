varying vec2 vUv;

uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;

void main() {
    
    vec3 baseColor = vec3( 0.121, 0.31, 0.17 );
    float clarity = ( vUv.y * 0.01 ) + 0.1;

    gl_FragColor = vec4( baseColor * clarity , 1 );

    #ifdef USE_FOG

        #ifdef USE_LOGDEPTHBUF_EXT
            float depth = gl_FragDepthEXT / gl_FragCoord.w;
        #else
            float depth = gl_FragCoord.z / gl_FragCoord.w;
        #endif

        float fogFactor = smoothstep( fogNear, fogFar, depth );
        gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );

    #endif

}
