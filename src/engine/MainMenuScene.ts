import * as THREE from "three";
import { Mesh } from "three";
import * as Framework from "./framework/BaseScene";

import { Buttons, KeyHandler } from "./framework/KeyHandler";

import { Button } from "../gui/Button";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class MainMenuScene extends Framework.BaseScene {

    // private readonly camera: THREE.OrthographicCamera;
    private readonly camera: THREE.PerspectiveCamera;

    private readonly playButton: Button;
    private readonly restartButton: Button;
    private readonly creditsButton: Button;

    private readonly pointLight: THREE.PointLight;
    private readonly pointLightHelper: THREE.PointLightHelper;
    private readonly dimmedBackground: THREE.Mesh;

    // private readonly buttons: THREE.Group;

    private readonly raycaster: THREE.Raycaster;
    private readonly mousePosition: THREE.Vector2;

    private readonly cameraMatUpdateCallback: (e: UIEvent) => void;

    private readonly orbitControls: OrbitControls;

    private onDocumentMouseMove(event: MouseEvent): void {   
        
        this.mousePosition.x =  (event.clientX / window.innerWidth)  * 2 - 1;
        this.mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
    }

    public constructor(params: Framework.BaseSceneParameters) {

        super(params);

        // this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
        // this.camera.position.z = 1;
        // this.add(this.camera);

        this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        this.camera.position.z = 1;
        this.add(this.camera);

        this.playButton = new Button({
            position: new THREE.Vector3(0, .5, 0),
            size: new THREE.Vector2(0.6, 0.4),
            text: "PLAY",
            fontSize: 2.5,
            fontColor: "rgb(246, 246, 246)",
        });

        this.restartButton = new Button({
            position: new THREE.Vector3(0, 0, 0),
            size: new THREE.Vector2(0.6, 0.4),
            text: "RESTART",
            fontSize: 2.5,
            fontColor: "rgb(246, 246, 246)",
        });

        this.creditsButton = new Button({
            position: new THREE.Vector3(0, -.5, 0),
            size: new THREE.Vector2(0.6, 0.4),
            text: "CREDITS",
            fontSize: 2.5,
            fontColor: "rgb(246, 246, 246)",
        });

        this.raycaster = new THREE.Raycaster();
        this.mousePosition = new THREE.Vector2();
      
        this.pointLight = new THREE.PointLight(0xffffff, 3, 0);
        this.pointLight.position.set(0, 0, 5);
        this.add(this.pointLight);

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

        // this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        // this.orbitControls.enablePan = false;
      
    }

    public onDestruction = () => {
    
        document.removeEventListener("mousemove", this.onDocumentMouseMove.bind(this));

    };
      
    public onUpdate = (params: Framework.UpdateParameters) => {

        this.raycaster.setFromCamera(this.mousePosition, this.camera);

        const intersectsPlayButton    = this.raycaster.intersectObject(this.playButton);
        const intersectsRestartButton = this.raycaster.intersectObject(this.restartButton);
        const intersectsCreditsButton = this.raycaster.intersectObject(this.creditsButton);

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

