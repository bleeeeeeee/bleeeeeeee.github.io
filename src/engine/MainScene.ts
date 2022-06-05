import * as THREE from "three";
import * as Framework from "./framework/BaseScene";

import { ThreeApplication } from "./ThreeApplication";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { KeyHandler } from "./framework/KeyHandler";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class MainScene extends Framework.BaseScene {

    private readonly ENTITY_HEIGHT: number = 0.2;

    private readonly camera: THREE.PerspectiveCamera;
    private readonly controls: OrbitControls;

    private readonly backgroundTexture: THREE.CubeTexture;
    private readonly ground: THREE.Mesh;
    private player: THREE.Object3D;

    private readonly GLTFLoader: GLTFLoader;
    private readonly cameraMatUpdateCallback: (e: UIEvent) => void;

    private readonly cubeTextureLoader = new THREE.CubeTextureLoader();

    private readonly hemisphereLight: THREE.HemisphereLight;
    private readonly mainLight: THREE.DirectionalLight;
    private readonly fakeSunLight: THREE.PointLight;

    public constructor(params: Framework.BaseSceneParameters) {

        super(params);

        // camera

        this.camera = new THREE.PerspectiveCamera(50, (innerWidth / innerHeight), 0.1, 1000.0);
        this.camera.name = "main-camera";
        this.camera.position.y = 1.0;
        // this.camera.position.x = 2.0;
        this.camera.position.z = 3.0;
        this.camera.lookAt(new THREE.Vector3(0, 0.2, -5));

        // this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        // this.controls.enableZoom = true;
        // this.controls.enablePan = false;
        // this.controls.enableDamping = true;
        // this.controls.rotateSpeed = - 0.25;
        
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

        // ground texture

        const groundTextureAlbedo   = new THREE.TextureLoader().load("/resources/textures/ground/albedo.png");
        const groundTextureBump     = new THREE.TextureLoader().load("/resources/textures/ground/albedo.png");

        groundTextureAlbedo.wrapS   = groundTextureAlbedo.wrapT  = 
        groundTextureBump.wrapS     = groundTextureBump.wrapT    = THREE.RepeatWrapping;

        groundTextureAlbedo.repeat.set(75, 150);
        groundTextureBump.repeat.set(75, 150);

        const groundGeometry = new THREE.PlaneGeometry(250, 500, 1000, 1);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: "rgb(255, 255, 255)",
            
            side: THREE.FrontSide,
            shadowSide: THREE.FrontSide,

            map: groundTextureAlbedo,
            bumpMap: groundTextureBump,
            bumpScale: 0.1,
        });

        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.receiveShadow = true;
        this.ground.castShadow = true;
        this.ground.name = "ground";
        this.ground.rotation.x = -Math.PI / 2;
        
        // test model

        this.GLTFLoader = new GLTFLoader();
        this.GLTFLoader.load(
            
            "/resources/objects/cat/2887649_Cat+Cube.glb", 
            
            ( player ) => {

                player.animations;  // Array<THREE.AnimationClip>
                player.scene;       // THREE.Group
                player.scenes;      // Array<THREE.Group>
                player.cameras;     // Array<THREE.Camera>
                player.asset;       // Object

                player.scene.rotation.y = Math.PI;
                this.player = player.scene;
            },
            
            ( xhr ) => {
                console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            },
            
            ( error ) => {
                console.log(error);
            }
        );

//         const playerTextureAlbedo   = new THREE.TextureLoader().load("/resources/textures/stylized-fur/albedo.png");
//         const playerTextureBump     = new THREE.TextureLoader().load("/resources/textures/stylized-fur/height.png");
//         const playerTextureNormals  = new THREE.TextureLoader().load("/resources/textures/stylized-fur/normals.png");

//         const playerGeometry = new THREE.BoxGeometry(1, this.ENTITY_HEIGHT, 1);
//         const playerMaterial = new THREE.MeshStandardMaterial({ 
//             color: "rgb(255, 255, 255)",
//             side: THREE.FrontSide,
//             map: playerTextureAlbedo,

//             bumpMap: playerTextureBump,
//             bumpScale: 1,
//             normalMap: playerTextureNormals,
//             normalScale: new THREE.Vector2(2, 2),
//         });

//         this.player = new THREE.Mesh(playerGeometry, playerMaterial);
//         this.player.name = "player";
//         this.player.position.y = playerGeometry.parameters.height / 2 + 0.2;
//         this.player.castShadow = true;

        // main world lighting

        const skyLight      = "rgb(74, 89, 105)";
        const groundLight   = "rgb(113, 78, 36)";

        this.hemisphereLight = new THREE.HemisphereLight(skyLight, groundLight, 1);
        this.hemisphereLight.position.set(0, 100, 0);

        this.mainLight = new THREE.DirectionalLight("rgb(74, 89, 105)", 2);
        this.mainLight.position.set(0, 10, 0);
        this.mainLight.target.position.set(0, 0, 0);
        this.mainLight.castShadow = true;

        this.mainLight.shadow.bias          = -0.004;
        this.mainLight.shadow.camera.near   = 0.1;
        this.mainLight.shadow.camera.far    = 1000;
        this.mainLight.shadow.camera.left   = this.mainLight.shadow.camera.bottom  = -1000;
        this.mainLight.shadow.camera.top    = this.mainLight.shadow.camera.right   = 1000;
        this.mainLight.shadow.mapSize.width = this.mainLight.shadow.mapSize.height = 4096;

        this.cameraMatUpdateCallback = ThreeApplication.createPerspectiveCameraResizer(this.renderer, this.camera);
    }

    public onInitialization = (params: Framework.InitializeParameters) => {

        this.managerKey = params.key;
        window.addEventListener("resize", this.cameraMatUpdateCallback);

        this.background = this.backgroundTexture;
        
        this.player.position.z = this.ground.geometry.parameters.height / 2 - 5;
        this.add(this.ground);
        this.add(this.player);

        this.player.add(this.camera);

        this.add(this.hemisphereLight);
        this.add(this.mainLight);
        this.add(this.fakeSunLight);
    };

    public onDestruction = () => {

        window.removeEventListener("resize", this.cameraMatUpdateCallback);

    };

    public onUpdate = (params: Framework.UpdateParameters) => {
        
        // this.controls.target.copy(this.player.position);
        
        const SPEED = 3;
        const distance = SPEED * params.deltaTime;

        if (KeyHandler.isKeyPressed("ArrowUp"))    this.player.position.z -= distance;
        if (KeyHandler.isKeyPressed("ArrowDown"))  this.player.position.z += distance;
        if (KeyHandler.isKeyPressed("ArrowLeft"))  this.player.position.x -= distance;
        if (KeyHandler.isKeyPressed("ArrowRight")) this.player.position.x += distance;

        if (KeyHandler.isKeyPressed("Escape"))     this.sceneManager.setCurrent("main-menu-scene");

    };

    public onRender = (params: Framework.RenderParameters) => {

        //this.controls.update();
        this.renderer.render(this, this.camera);

    };

}
