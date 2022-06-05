import * as THREE from "three";
import * as Framework from "./framework/BaseScene";

import { Buttons, KeyHandler } from "./framework/KeyHandler";
import { ThreeApplication } from "./ThreeApplication";

// import { Button } from "../gui/Button";

// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class MainMenuScene extends Framework.BaseScene {

    private readonly camera: THREE.PerspectiveCamera;
    private readonly playButton: THREE.Mesh;
    private readonly restartButton: THREE.Mesh;
    private readonly creditsButton: THREE.Mesh;

    private readonly buttons: THREE.Group;

    private readonly raycaster: THREE.Raycaster;
    private readonly mousePosition: THREE.Vector2;

    // private readonly orbitControls: OrbitControls;

    private readonly cameraMatUpdateCallback: (e: UIEvent) => void;

    private onDocumentMouseMove(event: MouseEvent): void {   
        
        this.mousePosition.x =  (event.clientX / window.innerWidth)  * 2 - 1;
        this.mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;

        console.log(this.mousePosition);
        
    }

    public constructor(params: Framework.BaseSceneParameters) {

        super(params);

        this.camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.x = 0.0;
        this.camera.position.y = 0.0;
        this.camera.position.z = 10.0;
        this.add(this.camera);

        // const axesHelper = new THREE.AxesHelper(200);
        // this.add(axesHelper);

        // this.buttons = new THREE.Group();
        // this.buttons.name = "buttons";
        // this.buttons.add(new Button({
        //     position: new THREE.Vector3(0, 0, 0),
        //     size: new THREE.Vector2(10, 4),
        //     text: "Play",
        //     fontSize: 80,
        //     fontColor: 0xff0000,
        // }));

        const buttonGeometry = new THREE.PlaneGeometry(15, 4, 10, 1);
        const buttonMaterial = new THREE.MeshBasicMaterial({
            color: "rgb(255, 255, 255)",
        });

        this.playButton = new THREE.Mesh(buttonGeometry, buttonMaterial);
        this.restartButton = new THREE.Mesh(buttonGeometry, buttonMaterial);
        this.creditsButton = new THREE.Mesh(buttonGeometry, buttonMaterial);

        this.playButton.position.y = 5.0;
        this.restartButton.position.y = 0.0;
        this.creditsButton.position.y = -5.0;

        this.raycaster = new THREE.Raycaster();
        this.mousePosition = new THREE.Vector2();

        // this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        // this.orbitControls.enablePan = false;

        this.cameraMatUpdateCallback = ThreeApplication.createPerspectiveCameraResizer(this.renderer, this.camera);

    }

    public onInitialization = (params: Framework.InitializeParameters) => {

        this.managerKey = params.key;
        window.addEventListener("resize", this.cameraMatUpdateCallback);
        document.addEventListener("mousemove", this.onDocumentMouseMove.bind(this));

        this.add(this.playButton, this.restartButton, this.creditsButton);
        // this.add(this.buttons);

        this.renderer.setClearColor("rgb(52, 152, 219)", 0.5);
    
    };
    
    public onDestruction = () => {
    
        window.addEventListener("resize", this.cameraMatUpdateCallback);
        document.removeEventListener("mousemove", this.onDocumentMouseMove.bind(this));
        this.renderer.setClearColor("rgb(0, 0, 0)", 1);

    };
      
    public onUpdate = (params: Framework.UpdateParameters) => {

        this.raycaster.setFromCamera(this.mousePosition, this.camera);

        const intersectsPlayButton = this.raycaster.intersectObject(this.playButton);
        const intersectsRestartButton = this.raycaster.intersectObject(this.restartButton);
        const intersectsCreditsButton = this.raycaster.intersectObject(this.creditsButton);

        this.playButton.material = new THREE.MeshBasicMaterial({
            color: intersectsPlayButton.length ? 0x00ff00 : 0xff0000,
        });

        this.restartButton.material = new THREE.MeshBasicMaterial({
            color: intersectsRestartButton.length ? 0x00ff00 : 0xff0000,
        });

        this.creditsButton.material = new THREE.MeshBasicMaterial({
            color: intersectsCreditsButton.length ? 0x00ff00 : 0xff0000,
        });

        if (KeyHandler.isButtonPressed(0)) {
      
            if (intersectsPlayButton.length) {
                this.sceneManager.setCurrent("main-scene");
            }

            if (intersectsRestartButton.length) {
                this.sceneManager.setCurrent("main-scene");
            }

            if (intersectsCreditsButton.length) {
                this.sceneManager.setCurrent("credits-scene");
            }
      
        }
    };

    public onRender = (params: Framework.RenderParameters) => {

        this.renderer.render(this, this.camera);

    };


}

