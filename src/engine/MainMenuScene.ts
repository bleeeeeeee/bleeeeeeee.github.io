import * as THREE from "three";
import * as Framework from "./framework/BaseScene";
import { Text } from "troika-three-text";

import { Buttons, KeyHandler } from "./framework/KeyHandler";

import { Button } from "../gui/Button";

// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class MainMenuScene extends Framework.BaseScene {

    private readonly camera: THREE.PerspectiveCamera;

    private readonly playButton: Button;
    private readonly restartButton: Button;
    private readonly creditsButton: Button;

    private readonly raycaster: THREE.Raycaster;
    private readonly mousePosition: THREE.Vector2;

    // private readonly orbitControls: OrbitControls;

    private readonly cameraMatUpdateCallback: (e: UIEvent) => void;

    private onDocumentMouseMove(event: MouseEvent): void {   
        
        this.mousePosition.x =  (event.clientX / window.innerWidth)  * 2 - 1;
        this.mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;

        console.log(this.mousePosition);
        
    }

    private readonly testText = new Text();

    public constructor(params: Framework.BaseSceneParameters) {

        super(params);

        this.camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.x = 0.0;
        this.camera.position.y = 0.0;
        this.camera.position.z = 10.0;
        this.add(this.camera);

        this.playButton = new Button({
            position: new THREE.Vector3(0, 5, 0),
            size: new THREE.Vector2(14, 3.5),
            text: "play",
            fontSize: 2.5,
            fontColor: "rgb(246, 246, 246)",
        });

        this.restartButton = new Button({
            position: new THREE.Vector3(0, 0, 0),
            size: new THREE.Vector2(14, 3.5),
            text: "restart",
            fontSize: 2.5,
            fontColor: "rgb(246, 246, 246)",
        });

        this.creditsButton = new Button({
            position: new THREE.Vector3(0, -5, 0),
            size: new THREE.Vector2(14, 3.5),
            text: "credits",
            fontSize: 2.5,
            fontColor: "rgb(246, 246, 246)",
        });

        this.raycaster = new THREE.Raycaster();
        this.mousePosition = new THREE.Vector2();

        // this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        // this.orbitControls.enablePan = false;
    
        // const axesHelper = new THREE.AxesHelper( 200 );
        // this.add( axesHelper );
    }

    public onInitialization = (params: Framework.InitializeParameters) => {

        this.managerKey = params.key;
        document.addEventListener("mousemove", this.onDocumentMouseMove.bind(this));

        this.add(this.playButton, this.restartButton, this.creditsButton);

        this.renderer.setClearColor("rgb(0, 0, 0)", 0.5);
    
    };
    
    public onDestruction = () => {
    
        document.removeEventListener("mousemove", this.onDocumentMouseMove.bind(this));
        this.renderer.setClearColor("rgb(0, 0, 0)", 1);

    };
      
    public onUpdate = (params: Framework.UpdateParameters) => {

        this.raycaster.setFromCamera(this.mousePosition, this.camera);

        const intersectsPlayButton    = this.raycaster.intersectObject(this.playButton);
        const intersectsRestartButton = this.raycaster.intersectObject(this.restartButton);
        const intersectsCreditsButton = this.raycaster.intersectObject(this.creditsButton);

        if (KeyHandler.isButtonPressed(0)) {
      
            if (intersectsPlayButton.length) {
                this.sceneManager.setCurrent("main-scene");
            }

            if (intersectsRestartButton.length) {
                this.sceneManager.setCurrent("main-scene");
                // + restart position and counter
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

