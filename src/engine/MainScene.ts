import * as THREE from "three";
import * as Framework from "./framework/BaseScene";

import { ThreeApplication } from "./ThreeApplication";

import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { KeyHandler } from "./framework/KeyHandler";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export class MainScene extends Framework.BaseScene {

    private readonly GLTFLoader: GLTFLoader;
    private readonly cubeTextureLoader = new THREE.CubeTextureLoader();
    
    private readonly camera: THREE.PerspectiveCamera;

    // private readonly ENTITY_HEIGHT: number = 0.2;
    private readonly WORLD_HEIGHT: number = 100;
    private readonly WORLD_WIDTH: number = 250;
    private readonly WORLD_DEPTH: number = 500;

    private readonly backgroundTexture: THREE.CubeTexture;
    private readonly atmosphere: THREE.Mesh;
    
    private readonly rain: THREE.Points;
    private readonly rainGeometry: THREE.BufferGeometry;
    private readonly rainMaterial: THREE.PointsMaterial;
    private readonly rainDrop: THREE.Vector3;
    private readonly rainCount: number = 50000;
    private velocity: number;

    private readonly ground: THREE.Mesh;
    private readonly player: THREE.Object3D;

    private readonly ambientLight: THREE.AmbientLight;
    private readonly hemisphereLight: THREE.HemisphereLight;
    private readonly mainLight: THREE.DirectionalLight;
    private readonly flashLight: THREE.PointLight;

    // private OrbitControls: OrbitControls;

    private startTextGeometry: TextGeometry;
    private readonly startTextMaterial: THREE.MeshStandardMaterial;
    private readonly startText: THREE.Mesh;

    private readonly cameraMatUpdateCallback: (e: UIEvent) => void;

    public constructor(params: Framework.BaseSceneParameters) {

        super(params);

        // camera

        this.camera = new THREE.PerspectiveCamera(50, (innerWidth / innerHeight), 0.1, 1000.0);
        this.camera.name = "main-camera";
        this.camera.position.y = 2.0;
        // this.camera.position.x = 2.0;
        this.camera.position.z = 3.0;
        this.camera.lookAt(new THREE.Vector3(0, 0.1, -5)); // 0.1
        
        // background texture

        this.cubeTextureLoader = new THREE.CubeTextureLoader();
        this.backgroundTexture = this.cubeTextureLoader.load([
            "/resources/textures/cubemap-4/px.png",
            "/resources/textures/cubemap-4/nx.png",
            "/resources/textures/cubemap-4/py.png",
            "/resources/textures/cubemap-4/ny.png",
            "/resources/textures/cubemap-4/pz.png",
            "/resources/textures/cubemap-4/nz.png",
        ]);

        this.backgroundTexture.format = THREE.RGBAFormat;
        this.backgroundTexture.mapping = THREE.CubeReflectionMapping;
        this.backgroundTexture.encoding = THREE.sRGBEncoding;
        this.backgroundTexture.flipY = false;
        this.backgroundTexture.generateMipmaps = false;
        this.backgroundTexture.needsUpdate = true;

        // atmosphere

        const atmosphereColor    = new THREE.Color("rgb(52, 93, 109)");
        const atmosphereGeometry = new THREE.BoxGeometry(this.WORLD_WIDTH, this.WORLD_HEIGHT, this.WORLD_DEPTH);
        const atmosphereMaterial = new THREE.MeshBasicMaterial({
            color: atmosphereColor,
            side: THREE.DoubleSide,
            opacity: 1,
            transparent: true,
        });

        this.atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);

        // flashlight (without animation)

        this.flashLight = new THREE.PointLight("rgb(22, 22, 22)", 100, 500, 0.9);
        this.flashLight.position.set(0, 200, 0);

        // rain (without animation)
        
        const points = [];
        this.velocity = 0;        
    
        for(let i = 0; i < this.rainCount; i++) {

            this.rainDrop = new THREE.Vector3(
                Math.random() * 200 - 100,
                Math.random() * 200 - 100,
                Math.random() * 500 - 250,
            );

            points.push(this.rainDrop);

        }

        this.rainGeometry = new THREE.BufferGeometry().setFromPoints(points);

        this.rainMaterial = new THREE.PointsMaterial({
            color: "rgb(94, 159, 243)",
            size: 0.1,
            transparent: true,
            opacity: 0.6,
            fog: true,
        });

        this.rain = new THREE.Points(this.rainGeometry, this.rainMaterial);

        // ground texture

        const groundTextureAlbedo   = new THREE.TextureLoader().load("/resources/textures/ground/albedo.png");
        const groundTextureBump     = new THREE.TextureLoader().load("/resources/textures/ground/albedo.png");

        groundTextureAlbedo.wrapS   = groundTextureAlbedo.wrapT  = 
        groundTextureBump.wrapS     = groundTextureBump.wrapT    = THREE.RepeatWrapping;

        groundTextureAlbedo.repeat.set(75, 150);
        groundTextureBump.repeat.set(75, 150);

        const groundGeometry = new THREE.PlaneGeometry(250, 500, 1000, 1);
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

        // main world lighting

        this.ambientLight = new THREE.AmbientLight("rgb(69, 76, 86)", 0.7);

        const skyLight      = "rgb(69, 76, 86)";
        const groundLight   = "rgb(113, 78, 36)";

        this.hemisphereLight = new THREE.HemisphereLight(skyLight, groundLight, 0.7);
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

        // player model

        const playerScale = 0.25;
        this.player = new THREE.Object3D();

        this.GLTFLoader = new GLTFLoader();
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

        // the start

        const startLight0 = new THREE.SpotLight("rgb(45, 54, 6)", 100, 5, Math.PI, 4, 1.25);
        startLight0.position.set(2, 4, 231);
        startLight0.target.position.set(0, 0, 0);
        startLight0.castShadow = true;
        this.add(startLight0);

        const startLight1 = new THREE.SpotLight("rgb(0, 54, 6)", 100, 5, Math.PI, 4, 1.25);
        startLight1.position.set(0, 4, 229);
        startLight1.target.position.set(0, 0, 0);
        startLight1.castShadow = true;
        this.add(startLight1);

        const startLight2 = new THREE.SpotLight("rgb(45, 0, 6)", 100, 5, Math.PI, 4, 1.25);
        startLight2.position.set(-2, 4, 231);
        startLight2.target.position.set(0, 0, 0);
        startLight2.castShadow = true;
        this.add(startLight2);

        //

        this.cameraMatUpdateCallback = ThreeApplication.createPerspectiveCameraResizer(this.renderer, this.camera);
    }

    // public createControls = ( camera: THREE.Camera ): void => {

    //     this.OrbitControls = new OrbitControls( camera, this.renderer.domElement );

    //     this.OrbitControls.enableZoom = true;
    //     this.OrbitControls.minDistance = 10;
    //     this.OrbitControls.maxDistance = 1000;
    //     this.OrbitControls.minPolarAngle = 0;
    //     this.OrbitControls.maxPolarAngle = Math.PI;
    //     this.OrbitControls.enablePan = false;

    // };

    public onInitialization = (params: Framework.InitializeParameters) => {

        this.managerKey = params.key;
        window.addEventListener("resize", this.cameraMatUpdateCallback);

        this.background = this.backgroundTexture;

        this.fog = new THREE.FogExp2("rgb(50, 58, 66)", 0.05);
        this.add(this.atmosphere);
        this.add(this.rain);

        this.player.position.z = this.WORLD_DEPTH / 2 - 10;
        this.add(this.ground);
        this.add(this.player);

        this.player.add(this.camera);

        this.add(this.ambientLight);
        this.add(this.hemisphereLight);
        this.add(this.mainLight);
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

        if(Math.random() > 0.98 || this.flashLight.power > 100) {

            if(this.flashLight.power < 100) 
                this.flashLight.position.set(Math.random() * 400, 300 + Math.random() * 200, 100);

            this.flashLight.power = 50 + Math.random() * 500;
        }
        
        this.rain.position.y -= 0.2;
        if(this.rain.position.y < -Math.random() * 40) 
            this.rain.position.y = Math.random() * 40;
    };

    public onRender = (params: Framework.RenderParameters) => {

        this.renderer.render(this, this.camera);

    };
    

}


