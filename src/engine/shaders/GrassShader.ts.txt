// import * as THREE from "three";

// export interface GrassParameters {

//     fog: THREE.FogExp2;

// }
    
// export class GrassShader extends THREE.ShaderMaterial {

//     private readonly GrassShader: THREE.ShaderMaterial;

//     public constructor(params: GrassParameters) {

//         super();

//         // GRASS MATERIAL

//         const simpleNoise = `
//             float N (vec2 st) { // https://thebookofshaders.com/10/
//                 return fract( sin( dot( st.xy, vec2(12.9898,78.233 ) ) ) *  43758.5453123);
//             }

//             float smoothNoise( vec2 ip ) { // https://www.youtube.com/watch?v=zXsWftRdsvU
//                 vec2 lv = fract( ip );
//                 vec2 id = floor( ip );

//                 lv = lv * lv * ( 3. - 2. * lv );

//                 float bl = N( id );
//                 float br = N( id + vec2( 1, 0 ));
//                 float b = mix( bl, br, lv.x );

//                 float tl = N( id + vec2( 0, 1 ));
//                 float tr = N( id + vec2( 1, 1 ));
//                 float t = mix( tl, tr, lv.x );

//                 return mix( b, t, lv.y );
//             }
//         `;

//         const vertexShader = `
//             ${THREE.ShaderChunk[ "fog_pars_vertex" ]}

//             varying vec2 vUv;
//             uniform float time;

//             ${simpleNoise}

//             void main() {

//                 ${THREE.ShaderChunk[ "fog_vertex" ]}

//                 vUv = uv;
//                 float t = time * 2.;
                
//                 // VERTEX POSITION
                
//                 vec4 mvPosition = vec4( position, 1.0 );
//                 #ifdef USE_INSTANCING
//                     mvPosition = instanceMatrix * mvPosition;
//                 #endif
                
//                 // DISPLACEMENT
                
//                 float noise = smoothNoise(mvPosition.xz * 0.5 + vec2(0., t));
//                 noise = pow(noise * 0.5 + 0.5, 2.) * 2.;
                
//                 // here the displacement is made stronger on the blades tips.
//                 float dispPower = 1. - cos( uv.y * 3.1416 * 0.5 );
                
//                 float displacement = noise * ( 0.3 * dispPower );
//                 mvPosition.z -= displacement;
                
//                 //
                
//                 vec4 modelViewPosition = modelViewMatrix * mvPosition;
//                 gl_Position = projectionMatrix * modelViewPosition;

//             }
//         `;

//         const fragmentShader = `
//             varying vec2 vUv;

//             ${THREE.ShaderChunk[ "common" ]}
//             ${THREE.ShaderChunk[ "fog_pars_fragment" ]}

//             void main() 

//                 vec3 baseColor = vec3( 0.321, 0.341, 0.282 );
//                 float clarity = ( vUv.y * 0.2 ) + 0.125;

//                 gl_FragColor = vec4( baseColor * clarity , 1 );
//                 ${THREE.ShaderChunk[ "fog_fragment" ]}
                
//             }
//         `;

//         const grassUniforms = { 
//             time:        { value: 0.0 },
//             offset:      { type: "f", value: 33 },
//             exponent:    { type: "f", value: 0.6 },
//             fogColor:    { type: "c", value: params.fog.color },
//             fogDensity:  { type: "f", value: params.fog.density }
//         };

//         this.GrassShader = new THREE.ShaderMaterial();

//         this.GrassShader.uniforms = THREE.UniformsUtils.merge( [
//             THREE.UniformsLib[ "fog" ],
//             grassUniforms
//         ] );

//         this.GrassShader.vertexShader = vertexShader;
//         this.GrassShader.fragmentShader = fragmentShader;
//         this.GrassShader.side = THREE.DoubleSide;
//         this.GrassShader.fog = true;

//     }    

// }
