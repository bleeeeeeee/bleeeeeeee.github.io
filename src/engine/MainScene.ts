import * as THREE from "three";
import * as Framework from "./framework/BaseScene";

import { ThreeApplication } from "./ThreeApplication";

import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { KeyHandler } from "./framework/KeyHandler";

export class MainScene extends Framework.BaseScene {

    private readonly WORLD_HEIGHT: number = 100;
    private readonly WORLD_WIDTH: number = 250;
    private readonly WORLD_DEPTH: number = 500;


    private clock: THREE.Clock;


    private readonly GLTFLoader: GLTFLoader;
    private readonly audioLoader: THREE.AudioLoader;


    private readonly camera: THREE.PerspectiveCamera;


    private readonly ambientLight: THREE.AmbientLight;
    private readonly hemisphereLight: THREE.HemisphereLight;
    private readonly mainLight: THREE.DirectionalLight;
    private readonly flashLight: THREE.PointLight;
    private readonly foleyLights: THREE.Group;

    
    private readonly atmosphere: THREE.Mesh;
    private readonly audioListener: THREE.AudioListener;
    private readonly globalAudio: THREE.Audio;
    private readonly thunderstruckAudioBump: THREE.Audio;
    private readonly thunderstruckAudioDecay: THREE.Audio;

    private readonly rain: THREE.Points;
    private readonly rainGeometry: THREE.BufferGeometry;
    private readonly rainMaterial: THREE.PointsMaterial;
    private readonly rainDrop: THREE.Vector3;
    private readonly rainCount: number = 200000;


    private readonly ground: THREE.Mesh;
    private readonly player: THREE.Object3D;

    private readonly trees: THREE.Points;
    private readonly treesGeometry: THREE.BufferGeometry;
    private readonly singleTree: THREE.Object3D;
    private readonly treesGroup: THREE.Group;

    private readonly grassShader: THREE.ShaderMaterial;
    private readonly grassMesh: THREE.InstancedMesh;


    private readonly cameraMatUpdateCallback: (e: UIEvent) => void;


    public constructor(params: Framework.BaseSceneParameters) {

        super(params);

        this.GLTFLoader = new GLTFLoader();
        this.audioLoader = new THREE.AudioLoader();

        // MAIN CAMERA //

        this.camera = new THREE.PerspectiveCamera(50, (innerWidth / innerHeight), 0.1, 1000.0);
        this.camera.name = "main-camera";
        this.camera.position.y = 2.0;
        // this.camera.position.x = 2.0;
        this.camera.position.z = 3.0;
        this.camera.lookAt(new THREE.Vector3(0, 0.8, -5)); 
        
        // WORLD LIGHTING

        this.ambientLight = new THREE.AmbientLight("rgb(69, 76, 86)", 0.5);

        const skyLight      = "rgb(69, 76, 86)";
        const groundLight   = "rgb(113, 78, 36)";

        this.hemisphereLight = new THREE.HemisphereLight(skyLight, groundLight, 0.9);
        this.hemisphereLight.position.set(0, 100, 0);

        this.mainLight = new THREE.DirectionalLight("rgb(69, 76, 86)", 1);
        this.mainLight.position.set(0, 100, 0);
        this.mainLight.target.position.set(0, 0, 0);
        this.mainLight.castShadow = true;

        this.mainLight.shadow.bias          = -0.004;
        this.mainLight.shadow.camera.near   = 0.1;
        this.mainLight.shadow.camera.far    = 1000;
        this.mainLight.shadow.camera.left   = this.mainLight.shadow.camera.bottom  = -1000;
        this.mainLight.shadow.camera.top    = this.mainLight.shadow.camera.right   = 1000;
        this.mainLight.shadow.mapSize.width = this.mainLight.shadow.mapSize.height = 4096;
        
        this.foleyLights = new THREE.Group();

        const startLight0 = new THREE.SpotLight("rgb(72, 88, 105)", 5, 10, Math.PI, 4, 1.25);
        startLight0.position.set(10, 2, 230);
        startLight0.target.position.set(0, 0, 0);
        startLight0.castShadow = true;
        this.foleyLights.add(startLight0);

        const startLight1 = new THREE.SpotLight("rgb(31, 56, 82)", 15, 10, Math.PI, 4, 1.25);
        startLight1.position.set(0, 2, 230);
        startLight1.target.position.set(0, 0, 0);
        startLight1.castShadow = true;
        this.foleyLights.add(startLight1);

        const startLight2 = new THREE.SpotLight("rgb(109, 127, 145)", 5, 10, Math.PI, 4, 1.25);
        startLight2.position.set(-10, 2, 230);
        startLight2.target.position.set(0, 0, 0);
        startLight2.castShadow = true;
        this.foleyLights.add(startLight2);

        let foleyLightsZPosition = 200;

        while(foleyLightsZPosition > -250) {
            
            const foleyLightSmall = new THREE.SpotLight("rgb(31, 56, 82)", 10, 10, Math.PI, 4, 1.25);
            foleyLightSmall.position.set(0, 2, foleyLightsZPosition);
            foleyLightSmall.target.position.set(0, 0, 0);
            foleyLightSmall.castShadow = true;
            this.foleyLights.add(foleyLightSmall);

            foleyLightsZPosition -= 50;

        }

        // ATMOSPHERE AND THUNDERSTORM //

        this.audioListener = new THREE.AudioListener();
        this.camera.add(this.audioListener);

        this.globalAudio = new THREE.Audio(this.audioListener);

        this.audioLoader.load("/resources/audio/rainfall.ogg", 
        
            (audioBuffer: AudioBuffer) => {
                this.globalAudio.setBuffer(audioBuffer);
                this.globalAudio.setLoop(true);
                this.globalAudio.setVolume(0.2);
                this.globalAudio.play();
            },
        
            ( event: ProgressEvent ) => { console.log((event.loaded / event.total) * 100 + "% loaded"); },

            ( event: ErrorEvent ) => { console.log(event); }

        );

        this.thunderstruckAudioBump = new THREE.Audio(this.audioListener);
        this.thunderstruckAudioDecay = new THREE.Audio(this.audioListener);

        this.flashLight = new THREE.PointLight("rgb(22, 22, 22)", 100, 500, 0.9);
        this.flashLight.position.set(0, 200, 0);

        const atmosphereColor    = new THREE.Color("rgb(52, 93, 109)");
        const atmosphereGeometry = new THREE.BoxGeometry(this.WORLD_WIDTH, this.WORLD_HEIGHT, this.WORLD_DEPTH);
        const atmosphereMaterial = new THREE.MeshBasicMaterial({
            color: atmosphereColor,
            side: THREE.DoubleSide,
            opacity: 1,
            transparent: true,
        });

        this.atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);

        this.fog = new THREE.Fog("rgb(50, 58, 66)", 1.0, 50.0);
        
        const points = [];     
    
        for(let i = 0; i < this.rainCount; i++) {

            this.rainDrop = new THREE.Vector3(
                Math.random() * 70 - 35,
                Math.random() * 200 - 100,
                Math.random() * this.WORLD_DEPTH - this.WORLD_DEPTH / 2,
            );

            points.push(this.rainDrop);

        }

        this.rainGeometry = new THREE.BufferGeometry().setFromPoints(points);

        this.rainMaterial = new THREE.PointsMaterial({
            color: "rgb(52, 78, 96)",
            size: 0.1,
            transparent: true,
            opacity: 1,
            fog: true,
        });

        this.rain = new THREE.Points(this.rainGeometry, this.rainMaterial);
        
        // GROUND AND FOLEY //

        const groundTextureAlbedo   = new THREE.TextureLoader().load("/resources/textures/ground/albedo.png");
        const groundTextureBump     = new THREE.TextureLoader().load("/resources/textures/ground/albedo.png");

        groundTextureAlbedo.wrapS   = groundTextureAlbedo.wrapT  = 
        groundTextureBump.wrapS     = groundTextureBump.wrapT    = THREE.RepeatWrapping;

        groundTextureAlbedo.repeat.set(75, 150);
        groundTextureBump.repeat.set(75, 150);

        const groundGeometry = new THREE.PlaneGeometry(this.WORLD_WIDTH, this.WORLD_DEPTH, 1000, 1);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: "rgb(69, 76, 86)",
            
            side: THREE.FrontSide,
            shadowSide: THREE.FrontSide,

            map: groundTextureAlbedo,
            bumpMap: groundTextureBump,
            bumpScale: 0.2,
        });

        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.receiveShadow = true;
        this.ground.castShadow = true;
        this.ground.name = "ground";
        this.ground.rotation.x = -Math.PI / 2;

        this.treesGroup = new THREE.Group();

        for(let i = 0; i < 1200; i++) {

            const Random110 = Math.floor(Math.random() * 10) + 1;
            
            this.GLTFLoader.load(
                
                "/resources/objects/trees/mesh/tree_" + Random110 + ".glb", 
                
                ( tree: GLTF ) => {
                    
                    tree.scene.scale.set(5, 5, 5);
                    tree.scene.rotation.y = Math.random() * Math.PI;
                    tree.scene.position.set(
                        Math.random() * 40 - 20,
                        Math.random() * (0 - (-5) + 1) + (-5),
                        Math.random() * this.WORLD_DEPTH - this.WORLD_DEPTH / 2,
                    );

                    tree.scene.castShadow = true;
                    tree.scene.receiveShadow = true;
                    
                    const boundingBox = new THREE.Box3().setFromObject(tree.scene);
                    boundingBox.expandByScalar(-0.75);

                    if(tree.scene.position.x > 5 || tree.scene.position.x < -5) {
                        this.treesGroup.add(tree.scene);
                    }

                },
            
                ( event: ProgressEvent ) => { console.log((event.loaded / event.total) * 100 + "% loaded"); },
                
                ( event: ErrorEvent ) => { console.log(event); }
            
            );
        }

        const simpleNoise = `
            float N (vec2 st) { // https://thebookofshaders.com/10/
                return fract( sin( dot( st.xy, vec2(12.9898,78.233 ) ) ) *  43758.5453123);
            }

            float smoothNoise( vec2 ip ) { // https://www.youtube.com/watch?v=zXsWftRdsvU
                vec2 lv = fract( ip );
                vec2 id = floor( ip );

                lv = lv * lv * ( 3. - 2. * lv );

                float bl = N( id );
                float br = N( id + vec2( 1, 0 ));
                float b = mix( bl, br, lv.x );

                float tl = N( id + vec2( 0, 1 ));
                float tr = N( id + vec2( 1, 1 ));
                float t = mix( tl, tr, lv.x );

                return mix( b, t, lv.y );
            }
        `;

        const grassVertexShader = `
            varying vec2 vUv;
            uniform float time;
            
            void main() {
        
                vUv = uv;
                
                // VERTEX POSITION
                
                vec4 mvPosition = vec4( position, 1.0 );
                #ifdef USE_INSTANCING
                    mvPosition = instanceMatrix * mvPosition;
                #endif
                
                // DISPLACEMENT
                
                // here the displacement is made stronger on the blades tips.
                float dispPower = 1.0 - cos( uv.y * 3.1416 / 2.0 );
                
                float displacement = sin( mvPosition.z + time * 10.0 ) * ( 0.1 * dispPower );
                mvPosition.z += displacement;
                
                //
                
                vec4 modelViewPosition = modelViewMatrix * mvPosition;
                gl_Position = projectionMatrix * modelViewPosition;
        
            }
        `;

        const grassFragmentShader = `
            varying vec2 vUv;

            uniform vec3 fogColor;
            uniform float fogNear;
            uniform float fogFar;

            void main() {
                
                vec3 baseColor = vec3( 0.121, 0.141, 0.17 );
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
        `;

        const grassUniforms = { 
            time:       { value: 0.0 },
            fogColor:   { type: "c", value: new THREE.Color(0xffffff) },
            fogNear:    { type: "f", value: 1.0 },
            fogFar:     { type: "f", value: 40.0 },
            lightDirection: { type: "v3", value: this.mainLight.target.position },
        };

        this.grassShader = new THREE.ShaderMaterial();

        this.grassShader.setValues({
            uniforms: THREE.UniformsUtils.merge( [
                THREE.UniformsLib[ "fog" ],
                grassUniforms
            ] ),
            vertexShader: grassVertexShader,
            fragmentShader: grassFragmentShader,
            side: THREE.DoubleSide,
        });

        this.grassShader.fog = true;
        
        const instanceNumber = 100000;
        const grassPoint = new THREE.Object3D();

        const geometry = new THREE.PlaneGeometry( 0.05, 0.2, 1, 2 );
        geometry.translate( 0, 0.5, 0 );

        this.grassMesh = new THREE.InstancedMesh( geometry, this.grassShader, instanceNumber );
        this.grassMesh.position.set(0, -0.1, 0);

        for (let i = 0 ; i < instanceNumber; i++) {

            grassPoint.position.set(
                ( Math.random() ) * 30 - 15,
                0,
                ( Math.random() ) * this.WORLD_DEPTH - this.WORLD_DEPTH / 2
            );
            
            grassPoint.scale.setScalar( 0.5 + Math.random() * 0.5 );
            
            grassPoint.rotation.y = Math.random() * Math.PI;
            grassPoint.castShadow = true;
            grassPoint.receiveShadow = true;

            grassPoint.updateMatrix();
            this.grassMesh.setMatrixAt( i, grassPoint.matrix );

        }

        // TODO: add rocks

        // PLAYER (CAT) //

        const playerScale = 0.3;
        this.player = new THREE.Object3D();

        
        this.GLTFLoader.load(
            
            "/resources/objects/cat/2887649_Cat+Cube.glb", 
            
            ( player: GLTF ) => {

                player.animations;  // Array<THREE.AnimationClip>
                player.scene;       // THREE.Group
                player.scenes;      // Array<THREE.Group>
                player.cameras;     // Array<THREE.Camera>
                player.asset;       // Object

                player.scene.scale.set(playerScale, playerScale, playerScale);
                player.scene.rotation.y = Math.PI;

                this.player.castShadow = true;
                this.player.receiveShadow = true;
                this.player.add(player.scene);
            },
            
            ( event: ProgressEvent ) => { console.log((event.loaded / event.total) * 100 + "% loaded"); },
            
            ( event: ErrorEvent ) => { console.log(event); }
            
        );

        this.player.position.set(0, 0, 0);
        
        //

        this.cameraMatUpdateCallback = ThreeApplication.createPerspectiveCameraResizer(this.renderer, this.camera);
    }

    public onInitialization = (params: Framework.InitializeParameters) => {

        this.clock = new THREE.Clock();

        // POSTPROCESSING



        //

        this.managerKey = params.key;
        window.addEventListener("resize", this.cameraMatUpdateCallback);

        this.add(this.player);
        this.player.add(this.camera);
        this.player.position.z = this.WORLD_DEPTH / 2 - 10;

        this.add(this.ground);
        this.add(this.treesGroup);
        this.add(this.grassMesh);

        this.add(this.ambientLight);
        this.add(this.hemisphereLight);
        this.add(this.mainLight);
        this.add(this.foleyLights);

        this.add(this.atmosphere);
        this.add(this.rain);
        this.add(this.flashLight);
    };

    public onDestruction = () => {

        window.removeEventListener("resize", this.cameraMatUpdateCallback);

    };

    public onUpdate = (params: Framework.UpdateParameters) => {
        
        const SPEED = 5;
        const distance = SPEED * params.deltaTime;

        if (KeyHandler.isKeyPressed("ArrowUp"))    this.player.position.z -= distance;
        if (KeyHandler.isKeyPressed("ArrowDown"))  this.player.position.z += distance;
        if (KeyHandler.isKeyPressed("ArrowLeft"))  this.player.position.x -= distance;
        if (KeyHandler.isKeyPressed("ArrowRight")) this.player.position.x += distance;

        if (KeyHandler.isKeyPressed("Escape"))     this.sceneManager.setCurrent("main-menu-scene");

        
        
        // RAIN, FLASHLIGHTS AND THUNDERSTRUCKS //

        if(Math.random() > 0.98 || this.flashLight.power > 100) {

            if(this.flashLight.power < 100) 
                this.flashLight.position.set(Math.random() * 400, 300 + Math.random() * 200, 100);

            this.flashLight.power = 50 + Math.random() * 800;


            if(this.flashLight.power > 400) {
                
                if(this.flashLight.power > 500) {
                
                    if(!this.thunderstruckAudioBump.isPlaying) {
                        
                        this.audioLoader.load("/resources/audio/thunder-struck-1.ogg", (audioBuffer: AudioBuffer) => {
                            this.thunderstruckAudioBump.setBuffer(audioBuffer);
                            this.thunderstruckAudioBump.setLoop(false);
                            this.thunderstruckAudioBump.setVolume(0.2);
                            this.thunderstruckAudioBump.play();
                        });
                    }
    
                }

                else if(!this.thunderstruckAudioDecay.isPlaying) {
                    
                    this.audioLoader.load("/resources/audio/thunder-struck-2.ogg", (audioBuffer: AudioBuffer) => {
                        this.thunderstruckAudioDecay.setBuffer(audioBuffer);
                        this.thunderstruckAudioDecay.setLoop(false);
                        this.thunderstruckAudioDecay.setVolume(0.4);
                        this.thunderstruckAudioDecay.play();
                    });
                } 

            }
        }
        
        this.rain.position.y -= 0.35;

        if(this.rain.position.y < -Math.random() * 40) {
            this.rain.position.y = Math.random() * 40;
        }
        
        // GRASS MOVEMENT //

        this.grassShader.uniforms.time.value = this.clock.getElapsedTime() / 2;
        this.grassShader.uniformsNeedUpdate = true;

    };

    public onRender = (params: Framework.RenderParameters) => {

        this.renderer.render(this, this.camera);

    };
    

}


