import * as THREE from "three";
import * as Framework from "./framework/BaseScene";

import { ThreeApplication } from "./ThreeApplication";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { KeyHandler } from "./framework/KeyHandler";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class MainScene extends Framework.BaseScene {

    private readonly ENTITY_HEIGHT: number = 0.2;

    private readonly camera: THREE.PerspectiveCamera;
    private readonly ground: THREE.Mesh;
    private player: THREE.Object3D;

    private readonly GLTFLoader: GLTFLoader;
    private readonly cameraMatUpdateCallback: (e: UIEvent) => void;

    public constructor(params: Framework.BaseSceneParameters) {

        super(params);

        this.camera = new THREE.PerspectiveCamera(75, (innerWidth / innerHeight), 0.1, 1000.0);
        this.camera.name = "main-camera";
        this.camera.position.y = 5.0;
        // this.camera.position.x = 2.0;
        this.camera.position.z = 2.0;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        const groundGeometry = new THREE.PlaneGeometry(10, 10, 10, 1);
        const groundMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.FrontSide,
            map: new THREE.TextureLoader().load("/resources/textures/ground.png",
                (texture: THREE.Texture) => console.log("Loaded ground texture!"),
                (event: ProgressEvent) => console.log("Loading ground texture: " + event.loaded + "/" + event.total),
                (event: ErrorEvent) => console.log("Error loading ground texture: " + event.message),),
        });

        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.name = "ground";
        this.ground.rotation.x = -Math.PI / 2;
        
        // test model

        this.GLTFLoader = new GLTFLoader();
        this.GLTFLoader.load(
            
            "/resources/objects/cat/2887649_Cat+Cube.glb", 
            
            ( player ) => {
                this.add( player.scene );

                player.animations;  // Array<THREE.AnimationClip>
                player.scene;       // THREE.Group
                player.scenes;      // Array<THREE.Group>
                player.cameras;     // Array<THREE.Camera>
                player.asset;       // Object

                this.renderer.render(player.scene, this.camera);
            },
            
            ( xhr ) => {
                console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            },
            
            ( error ) => {
                console.log(error);
            }
        );

        this.cameraMatUpdateCallback = ThreeApplication.createPerspectiveCameraResizer(this.renderer, this.camera);
        
        const controls = new OrbitControls( this.camera, this.renderer.domElement );
    }

    public onInitialization = (params: Framework.InitializeParameters) => {

        this.managerKey = params.key;
        window.addEventListener("resize", this.cameraMatUpdateCallback);

        this.add(this.ground);
        this.add(this.player);
    };

    public onDestruction = () => {

        window.removeEventListener("resize", this.cameraMatUpdateCallback);

    };

    public onUpdate = (params: Framework.UpdateParameters) => {

        const SPEED = 3;
        const distance = SPEED * params.deltaTime;

        if (KeyHandler.isKeyPressed("ArrowUp"))    this.player.position.z -= distance;
        if (KeyHandler.isKeyPressed("ArrowDown"))  this.player.position.z += distance;
        if (KeyHandler.isKeyPressed("ArrowLeft"))  this.player.position.x -= distance;
        if (KeyHandler.isKeyPressed("ArrowRight")) this.player.position.x += distance;

        if (KeyHandler.isKeyPressed("Escape")) {
            this.sceneManager.setCurrent("main-menu-scene");
        }

    };

    public onRender = (params: Framework.RenderParameters) => {

        this.renderer.render(this, this.camera);

    };

}
