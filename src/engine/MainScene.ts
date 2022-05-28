import * as THREE from "three";
import * as Framework from "./framework/BaseScene";

import { ThreeApplication } from "./ThreeApplication";

import { KeyHandler } from "./KeyHandler";

// class PlayerDirection {

//     public up = false;
//     public down = false;
//     public left = false;
//     public right = false;

//     public constructor() {
    
//     }

// }

export class MainScene extends Framework.BaseScene {

    private readonly ENTITY_HEIGHT: number = 0.3;

    private readonly camera: THREE.PerspectiveCamera;
    private readonly ground: THREE.Mesh;
    private readonly player: THREE.Mesh;

    /* TEMPORARY solution to handling player's movement. */
    // private readonly playerDirections: PlayerDirection;

    private readonly keyHandler: KeyHandler;

    private readonly raycaster: THREE.Raycaster;
    private readonly mousePosition: THREE.Vector2;

    private readonly cameraMatUpdateCallback: (e: UIEvent) => void;

    // private onKeyDown = (event: KeyboardEvent) => {

    //     switch (event.key) {

    //         case "ArrowUp":     this.playerDirections.up    = true; break;
    //         case "ArrowDown":   this.playerDirections.down  = true; break;
    //         case "ArrowLeft":   this.playerDirections.left  = true; break;
    //         case "ArrowRight":  this.playerDirections.right = true; break;

    //     }

    // };

    // private onKeyUp = (event: KeyboardEvent) => {

    //     switch (event.key) {

    //         case "ArrowUp":     this.playerDirections.up    = false; break;
    //         case "ArrowDown":   this.playerDirections.down  = false; break;
    //         case "ArrowLeft":   this.playerDirections.left  = false; break;
    //         case "ArrowRight":  this.playerDirections.right = false; break;

    //     }

    // };

    public constructor(params: Framework.BaseSceneParameters) {

        super(params);

        this.camera = new THREE.PerspectiveCamera(75, (innerWidth / innerHeight), 0.1, 1000.0);
        this.camera.name = "main-camera";
        this.camera.position.y = 5.0;
        this.camera.position.x = 2.0;
        this.camera.position.z = 2.0;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.add(this.camera);

        const groundGeoemtry = new THREE.PlaneGeometry(10, 10, 10, 1);
        const groundMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.FrontSide,
            map: new THREE.TextureLoader().load("resources/textures/ground.png",
                (texture: THREE.Texture) => console.log("Loaded ground texture!"),
                (event: ProgressEvent) => console.log("Loading ground texture: " + event.loaded + "/" + event.total),
                (event: ErrorEvent) => console.log("Error loading ground texture: " + event.message),),
        });

        this.ground = new THREE.Mesh(groundGeoemtry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.add(this.ground);

        const playerGeometry = new THREE.BoxGeometry(1, this.ENTITY_HEIGHT, 1);
        const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

        this.player = new THREE.Mesh(playerGeometry, playerMaterial);
        this.player.position.y = playerGeometry.parameters.height / 2;
        this.add(this.player);

        // this.playerDirections = new PlayerDirection();

        this.keyHandler = new KeyHandler();

        this.raycaster = new THREE.Raycaster();
        this.mousePosition = new THREE.Vector2();

        this.cameraMatUpdateCallback = ThreeApplication.createPerspectiveCameraResizer(this.renderer, this.camera);
        window.addEventListener("resize", this.cameraMatUpdateCallback);

        // document.addEventListener("keydown", this.onKeyDown);
        // document.addEventListener("keyup", this.onKeyUp);

    }

    public onInitialization = (params: Framework.InitializeParameters) => {

        this.managerKey = params.key;

    };

    public onDestruction = () => {

        window.removeEventListener("resize", this.cameraMatUpdateCallback);

    };

    public onUpdate = (params: Framework.UpdateParameters) => {

        // this.raycaster.setFromCamera(this.mousePosition, this.camera);

        const SPEED = 3;
        const distance = SPEED * params.deltaTime;

        // if (this.playerDirections.up)    this.player.position.z -= distance;
        // if (this.playerDirections.down)  this.player.position.z += distance;
        // if (this.playerDirections.left)  this.player.position.x -= distance;
        // if (this.playerDirections.right) this.player.position.x += distance;

        if (this.keyHandler.isKeyPressed("ArrowUp"))    this.player.position.z -= distance;
        if (this.keyHandler.isKeyPressed("ArrowDown"))  this.player.position.z += distance;
        if (this.keyHandler.isKeyPressed("ArrowLeft"))  this.player.position.x -= distance;
        if (this.keyHandler.isKeyPressed("ArrowRight")) this.player.position.x += distance;

        if (this.keyHandler.isKeyPressed("Escape")) {
            this.sceneManager.setCurrent("main-menu-scene");
        }

    };

    public onRender = (params: Framework.RenderParameters) => {

        this.renderer.render(this, this.camera);

    };

}
