import * as THREE from "three";
import * as Framework from "./framework/BaseScene";

import { ThreeApplication } from "./ThreeApplication";

import { KeyHandler } from "./KeyHandler";

export class MainScene extends Framework.BaseScene {

    private readonly ENTITY_HEIGHT: number = 0.2;

    private readonly camera: THREE.PerspectiveCamera;
    private readonly ground: THREE.Mesh;
    private readonly player: THREE.Mesh;

    private readonly cameraMatUpdateCallback: (e: UIEvent) => void;

    public constructor(params: Framework.BaseSceneParameters) {

        super(params);

        this.camera = new THREE.PerspectiveCamera(75, (innerWidth / innerHeight), 0.1, 1000.0);
        this.camera.name = "main-camera";
        this.camera.position.y = 5.0;
        // this.camera.position.x = 2.0;
        this.camera.position.z = 2.0;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        // this.add(this.camera);

        const groundGeometry = new THREE.PlaneGeometry(10, 10, 10, 1);
        const groundMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.FrontSide,
            map: new THREE.TextureLoader().load("resources/textures/ground.png",
                (texture: THREE.Texture) => console.log("Loaded ground texture!"),
                (event: ProgressEvent) => console.log("Loading ground texture: " + event.loaded + "/" + event.total),
                (event: ErrorEvent) => console.log("Error loading ground texture: " + event.message),),
        });

        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.add(this.ground);

        const playerGeometry = new THREE.BoxGeometry(1, this.ENTITY_HEIGHT, 1);
        const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

        this.player = new THREE.Mesh(playerGeometry, playerMaterial);
        this.player.position.y = playerGeometry.parameters.height / 2;
        this.add(this.player);
        this.player.add(this.camera);

        this.cameraMatUpdateCallback = ThreeApplication.createPerspectiveCameraResizer(this.renderer, this.camera);

    }

    public onInitialization = (params: Framework.InitializeParameters) => {

        this.managerKey = params.key;
        window.addEventListener("resize", this.cameraMatUpdateCallback);

    };

    public onDestruction = () => {

        window.removeEventListener("resize", this.cameraMatUpdateCallback);

    };

    public onUpdate = (params: Framework.UpdateParameters) => {

        const SPEED = 3;
        const distance = SPEED * params.deltaTime;

        if (KeyHandler.isPressed("ArrowUp"))    this.player.position.z -= distance;
        if (KeyHandler.isPressed("ArrowDown"))  this.player.position.z += distance;
        if (KeyHandler.isPressed("ArrowLeft"))  this.player.position.x -= distance;
        if (KeyHandler.isPressed("ArrowRight")) this.player.position.x += distance;

    };

    public onRender = (params: Framework.RenderParameters) => {

        this.renderer.render(this, this.camera);

    };

}
