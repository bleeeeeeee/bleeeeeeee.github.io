import * as THREE from "three";
import * as Framework from "./framework/BaseScene";

import { ThreeApplication } from "./ThreeApplication";

import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

import { KeyHandler } from "./framework/KeyHandler";
import { Object3D } from "three";

export class MainScene extends Framework.BaseScene {

    private readonly WORLD_HEIGHT: number = 100;
    private readonly WORLD_WIDTH: number = 250;
    private readonly WORLD_DEPTH: number = 500;


    private clock: THREE.Clock;


    private readonly GLTFLoader: GLTFLoader;
    private readonly audioLoader: THREE.AudioLoader;


    private readonly camera: THREE.PerspectiveCamera;
    private readonly flashlight: THREE.SpotLight;
    private timeElapsedFlashlight: number;

    private readonly ambientLight: THREE.AmbientLight;
    private readonly hemisphereLight: THREE.HemisphereLight;
    private readonly mainLight: THREE.DirectionalLight;
    private readonly foleyLights: THREE.Group;
    private readonly lampGroup: THREE.Group;

    
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
    private readonly struckLight: THREE.PointLight;


    private readonly ground: THREE.Mesh;
    private readonly treesGroup: THREE.Group;
    private readonly treesBackground1: THREE.Mesh;
    private readonly treesBackground2: THREE.Mesh;
    private readonly grassShader: THREE.ShaderMaterial;
    private readonly grassMesh: THREE.InstancedMesh;
    private readonly rockGroup: THREE.Group;


    private readonly player: THREE.Object3D;
    private animationMixer: THREE.AnimationMixer;
    private animationClip: THREE.AnimationClip;
    private readonly animationActions: THREE.AnimationAction[] = [];
    private readonly activeAction: THREE.AnimationAction;
    private readonly lastAction: THREE.AnimationAction;


    private readonly cameraMatUpdateCallback: (e: UIEvent) => void;


    public constructor(params: Framework.BaseSceneParameters) {

        super(params);

        this.GLTFLoader = new GLTFLoader();
        this.audioLoader = new THREE.AudioLoader();

        // MAIN CAMERA //

        this.camera = new THREE.PerspectiveCamera(50, (innerWidth / innerHeight), 0.1, 1000.0);
        this.camera.name = "main-camera";
        this.camera.position.y = 3.0;
        // this.camera.position.x = 2.0;
        this.camera.position.z = 4.0;
        this.camera.lookAt(new THREE.Vector3(0, 0.5, -5)); 

        // FLASHLIGHT //

        this.flashlight = new THREE.SpotLight(0xffffff, 20, 20, Math.PI * 0.1, 0.2, 1);
        this.flashlight.position.set(0, 1, -1);
        this.flashlight.target.position.set(0, 0, -500);
        
        // WORLD LIGHTING //

        this.ambientLight = new THREE.AmbientLight("rgb(69, 76, 86)", 0.5);

        const skyLight      = "rgb(69, 76, 86)";
        const groundLight   = "rgb(113, 78, 36)";

        this.hemisphereLight = new THREE.HemisphereLight(skyLight, groundLight, 0.9);
        this.hemisphereLight.position.set(0, 100, 0);

        this.mainLight = new THREE.DirectionalLight("rgb(69, 76, 86)", 1);
        this.mainLight.position.set(0, 100, 0);
        this.mainLight.target.position.set(0, 0, 0);

        this.mainLight.castShadow           = true;
        this.mainLight.shadow.bias          = -0.004;
        this.mainLight.shadow.camera.near   = 0.1;
        this.mainLight.shadow.camera.far    = 1000;
        this.mainLight.shadow.camera.left   = this.mainLight.shadow.camera.bottom  = -1000;
        this.mainLight.shadow.camera.top    = this.mainLight.shadow.camera.right   = 1000;
        this.mainLight.shadow.mapSize.width = this.mainLight.shadow.mapSize.height = 2048;
        
        this.foleyLights = new THREE.Group();
        this.lampGroup   = new THREE.Group();

        const startLight = new THREE.SpotLight("rgb(120, 120, 82)", 10, 6, Math.PI, 4, 1.1);
        startLight.position.set(0, 2, 230);
        startLight.target.position.set(0, 0, 0);
        startLight.castShadow = true;
        this.foleyLights.add(startLight);

        for(let i = 200; i > -250; i -= 50) {

            const foleyLightSmall = new THREE.SpotLight("rgb(31, 56, 82)", 20, 10, Math.PI, 4, 1.25);
            foleyLightSmall.position.set(0, 2, i);
            foleyLightSmall.target.position.set(0, 0, 0);
            foleyLightSmall.castShadow = true;
            this.foleyLights.add(foleyLightSmall);

            this.GLTFLoader.load(
                
                "/resources/objects/lamp/lamp-1.glb",
                
                ( lamp: GLTF ) => {
                    
                    lamp.scene.scale.setScalar(3);
                    lamp.scene.rotation.y = Math.PI / 2;
                    lamp.scene.position.set(-4, 0, i);

                    lamp.scene.castShadow = true;
                    lamp.scene.receiveShadow = true;

                    this.lampGroup.add(lamp.scene);

                },
            
                ( event: ProgressEvent ) => { console.log((event.loaded / event.total) * 100 + "% loaded"); },
                
                ( event: ErrorEvent ) => { console.log(event); }
            
            );

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

        this.struckLight = new THREE.PointLight("rgb(22, 22, 22)", 100, 500, 0.9);
        this.struckLight.position.set(0, 200, 0);

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

        const treesTexture1 = new THREE.TextureLoader().load("/resources/textures/trees_background/lastlo1.png");
        const treesTexture2 = new THREE.TextureLoader().load("/resources/textures/trees_background/lastlo4.png");

        treesTexture1.wrapS = treesTexture1.wrapT = 
        treesTexture2.wrapS = treesTexture2.wrapT = THREE.RepeatWrapping;
        treesTexture1.repeat.set(15, 1);
        treesTexture2.repeat.set(15, 1);

        const treesMaterial1 = new THREE.MeshStandardMaterial({
            color: "rgb(255, 255, 255)",
            side: THREE.FrontSide,
            map: treesTexture1,
        });

        const treesMaterial2 = new THREE.MeshStandardMaterial({
            color: "rgb(255, 255, 255)",
            side: THREE.FrontSide,
            map: treesTexture2,
        });

        this.treesBackground1 = new THREE.Mesh(new THREE.PlaneGeometry(this.WORLD_DEPTH, 20), treesMaterial1);
        this.treesBackground1.position.set(20, 10, 0);
        this.treesBackground1.rotation.set(0, -(Math.PI / 2), 0);

        this.treesBackground2 = new THREE.Mesh(new THREE.PlaneGeometry(this.WORLD_DEPTH, 20), treesMaterial2);
        this.treesBackground2.position.set(-20, 10, 0);
        this.treesBackground2.rotation.set(0, (Math.PI / 2), 0);

        const gtDIFF   = new THREE.TextureLoader().load("/resources/textures/betterground/_COL_1K.png");
        const gtNRM    = new THREE.TextureLoader().load("/resources/textures/betterground/NRM_1K.png");
        const gtAO     = new THREE.TextureLoader().load("/resources/textures/betterground/AO_1K.png");

        gtDIFF.wrapS = gtDIFF.wrapT = gtNRM.wrapS = gtNRM.wrapT =
        gtAO.wrapS   = gtAO.wrapT   = THREE.RepeatWrapping;

        const groundRepeatVectorS = 30;
        const groundRepeatVectorT = 2 * groundRepeatVectorS;

        gtDIFF.repeat.set(groundRepeatVectorS, groundRepeatVectorT);
        gtNRM.repeat.set(groundRepeatVectorS, groundRepeatVectorT);
        gtAO.repeat.set(groundRepeatVectorS, groundRepeatVectorT);

        const xOffset = .5;
        const yOffset = .25;  

        gtDIFF.offset.set(xOffset, yOffset);
        gtNRM.offset.set(xOffset, yOffset);
        gtAO.offset.set(xOffset, yOffset);

        const groundMaterial = new THREE.MeshPhysicalMaterial({
            color: "rgb(41, 45, 60)",

            map: gtDIFF,

            normalMap: gtNRM,
            normalMapType: THREE.TangentSpaceNormalMap,
            normalScale: new THREE.Vector2(2, 2),

            aoMap: gtAO,
            aoMapIntensity: 10,

            side: THREE.FrontSide,
            shadowSide: THREE.FrontSide,
        });

        const groundGeometry = new THREE.PlaneGeometry(this.WORLD_WIDTH, this.WORLD_DEPTH, 100, 100);

        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.receiveShadow = true;
        this.ground.castShadow = true;
        this.ground.rotation.x = -Math.PI / 2;

        this.treesGroup = new THREE.Group();

        for(let i = 0; i < 1300; i++) {

            const Random110 = Math.floor(Math.random() * 10) + 1;
            
            this.GLTFLoader.load(
                
                "/resources/objects/trees/mesh/tree_" + Random110 + ".glb", 
                
                ( tree: GLTF ) => {
                    
                    tree.scene.scale.set(5, 5, 5);
                    tree.scene.rotation.y = Math.random() * Math.PI;
                    tree.scene.position.set(
                        Math.random() * 40 - 20,
                        Math.random() * (-1 - (-3) + 1) + (-3),
                        Math.random() * this.WORLD_DEPTH - this.WORLD_DEPTH / 2,
                    );

                    tree.scene.castShadow = true;
                    tree.scene.receiveShadow = true;
                    
                    const boundingBox = new THREE.Box3().setFromObject(tree.scene);
                    boundingBox.expandByScalar(-0.75);

                    if(tree.scene.position.x > 7 || tree.scene.position.x < -7) {
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

                grassUniforms,

                THREE.UniformsLib["lights"],

            ] ),

            vertexShader: grassVertexShader,
            fragmentShader: grassFragmentShader,
            side: THREE.DoubleSide,

        });

        this.grassShader.fog = true;
        this.grassShader.lights = true;
        
        const instanceNumber = 1000000;
        const grassPoint = new THREE.Object3D();

        const geometry = new THREE.PlaneGeometry( 0.01, 0.2, 1, 2 );
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

        this.rockGroup = new THREE.Group();

        for(let i = 0; i < 200; i++) {

            const Random15 = Math.floor(Math.random() * (5 - 1 + 1) + (1)) + 1;
            
            this.GLTFLoader.load(
                
                "/resources/objects/rocks/rock-" + Random15 + ".glb", 
                
                ( rock: GLTF ) => {
                    
                    rock.scene.scale.setScalar(0.075);
                    rock.scene.rotation.y = Math.random() * Math.PI;
                    rock.scene.position.set(
                        Math.random() * 10 - 5,
                        -0.2,
                        Math.random() * this.WORLD_DEPTH - this.WORLD_DEPTH / 2,
                    );

                    rock.scene.castShadow = true;
                    rock.scene.receiveShadow = true;

                    this.rockGroup.add(rock.scene);

                },
            
                ( event: ProgressEvent ) => { console.log((event.loaded / event.total) * 100 + "% loaded"); },
                
                ( event: ErrorEvent ) => { console.log(event); }
            
            );
        }

        // PLAYER (CAT) //

        const playerScale = 3.5;
        this.player = new THREE.Object3D();

        this.GLTFLoader.load(
            
            "/resources/objects/better-cat/cat_rigged.glb", 
            
            ( player: GLTF ) => {

                player.scene.scale.setScalar(playerScale);
                player.scene.rotation.y = Math.PI / 2;

                this.player.castShadow = true;
                this.player.receiveShadow = true;

                this.animationMixer = new THREE.AnimationMixer(player.scene);

                player.animations.forEach( ( clip ) => { this.animationMixer.clipAction( clip ).play(); });

                this.animationMixer.timeScale = 1.5;

                this.player.add(player.scene);

            },

            ( event: ProgressEvent ) => { console.log((event.loaded / event.total) * 100 + "% loaded"); },
            
            ( event: ErrorEvent ) => { console.log(event); }
                
        );

        // starting position !!! //
        this.player.position.z = this.WORLD_DEPTH / 2 - 15;

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
        this.player.add(this.flashlight);
        this.add(this.flashlight.target);

        this.add(this.ground);
        this.add(this.treesGroup);
        this.add(this.grassMesh);
        this.add(this.treesBackground1);
        this.add(this.treesBackground2);
        this.add(this.rockGroup);

        this.add(this.ambientLight);
        this.add(this.hemisphereLight);
        this.add(this.mainLight);
        this.add(this.foleyLights);
        this.add(this.lampGroup);

        this.add(this.atmosphere);
        this.add(this.rain);
        this.add(this.struckLight);

        this.timeElapsedFlashlight = 0;
        this.flashlight.visible = false;

    };

    public onDestruction = () => {

        window.removeEventListener("resize", this.cameraMatUpdateCallback);

    };

    public onUpdate = (params: Framework.UpdateParameters) => {
        
        const SPEED = 20;
        const distance = SPEED * params.deltaTime;

        if (KeyHandler.isKeyPressed("w")) {
            if(this.animationMixer) {
                this.animationMixer.update(params.deltaTime);
            }
            this.player.position.z -= distance;
        }

        if (KeyHandler.isKeyPressed("s"))           this.player.position.z += distance;
        if (KeyHandler.isKeyPressed("a"))           this.player.position.x -= distance;
        if (KeyHandler.isKeyPressed("d"))           this.player.position.x += distance;

        if (KeyHandler.isKeyPressed("ArrowUp"))     this.camera.rotation.x += distance * 0.1;
        if (KeyHandler.isKeyPressed("ArrowDown"))   this.camera.rotation.x -= distance * 0.1;
        if (KeyHandler.isKeyPressed("ArrowRight"))  this.camera.rotation.y -= distance * 0.1;
        if (KeyHandler.isKeyPressed("ArrowLeft"))   this.camera.rotation.y += distance * 0.1;

        if (KeyHandler.isKeyPressed("Escape"))      this.sceneManager.setCurrent("main-menu-scene");

        if (KeyHandler.isKeyPressed("l") && this.timeElapsedFlashlight >= 1) {
            this.flashlight.visible = !this.flashlight.visible;
            this.timeElapsedFlashlight = 0;
        }
        this.timeElapsedFlashlight += params.deltaTime * 4;
        
        // RAIN, STRUCKLIGHTS AND THUNDERSTRUCKS //

        if(Math.random() > 0.98 || this.struckLight.power > 100) {

            if(this.struckLight.power < 100) 
                this.struckLight.position.set(Math.random() * 400, 300 + Math.random() * 200, 100);

            this.struckLight.power = 50 + Math.random() * 800;

            if(this.struckLight.power > 400) {
                
                if(this.struckLight.power > 500) {
                
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


