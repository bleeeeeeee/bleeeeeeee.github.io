import * as THREE from "three";
import { Mesh } from "three";
import * as Framework from "./framework/BaseScene";

import { Buttons, KeyHandler } from "./framework/KeyHandler";

// import { Button } from "../gui/Button";

// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class MainMenuScene extends Framework.BaseScene {

    private readonly camera: THREE.OrthographicCamera;

    private readonly playButton: THREE.Mesh;
    private readonly restartButton: THREE.Mesh;
    private readonly creditsButton: THREE.Mesh;

    private readonly dimmedBackground: THREE.Mesh;

    // private readonly buttons: THREE.Group;

    private readonly raycaster: THREE.Raycaster;
    private readonly mousePosition: THREE.Vector2;

    private readonly cameraMatUpdateCallback: (e: UIEvent) => void;

    private onDocumentMouseMove(event: MouseEvent): void {   
        
        this.mousePosition.x =  (event.clientX / window.innerWidth)  * 2 - 1;
        this.mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
    }

    public constructor(params: Framework.BaseSceneParameters) {

        super(params);

        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
        this.camera.position.z = 1;
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

        const buttonGeometry = new THREE.PlaneGeometry(0.6, 0.4, 10, 1);
        const buttonMaterial = new THREE.MeshBasicMaterial({
            color: "rgb(255, 255, 255)",
        });

        this.playButton = new THREE.Mesh(buttonGeometry, buttonMaterial);
        this.restartButton = new THREE.Mesh(buttonGeometry, buttonMaterial);
        this.creditsButton = new THREE.Mesh(buttonGeometry, buttonMaterial);

        this.playButton.position.y = .5;
        this.restartButton.position.y = .0;
        this.creditsButton.position.y = -.5;

        this.raycaster = new THREE.Raycaster();
        this.mousePosition = new THREE.Vector2();

        // this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        // this.orbitControls.enablePan = false;

        this.dimmedBackground = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 2, 10, 10),
            new THREE.MeshBasicMaterial({
                color: "rgb(0, 0, 0)",
                transparent: true,
                opacity: 0.5,
            }),
        );
        this.dimmedBackground.position.z = -0.1;
        this.add(this.dimmedBackground);

        document.addEventListener("mousemove", this.onDocumentMouseMove.bind(this));

        this.add(this.playButton, this.restartButton, this.creditsButton);
        // this.add(this.buttons);

    }

    public onDestruction = () => {
    
        document.removeEventListener("mousemove", this.onDocumentMouseMove.bind(this));

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
                this.sceneManager.pop();
            }

            if (intersectsRestartButton.length) {
                this.sceneManager.pop();
            }

            if (intersectsCreditsButton.length) {
                // this.sceneManager.setCurrent("credits-scene");
            }
      
        }
    };

    public onRender = (params: Framework.RenderParameters) => {

        this.renderer.render(this, this.camera);

    };


}

