import * as THREE from "three";
import * as Framework from "./framework/BaseScene";

import { ThreeApplication } from "./ThreeApplication";

export class MainScene extends Framework.BaseScene {

    private readonly camera: THREE.PerspectiveCamera;
    private readonly cube:   THREE.Mesh;

    private readonly cameraMatUpdateCallback: (e: UIEvent) => void;

    public constructor(params: Framework.BaseSceneParameters) {

        super(params);

        this.camera = new THREE.PerspectiveCamera(75, (innerWidth / innerHeight), 0.1, 1000.0);
        this.camera.name = "main-camera";
        this.camera.position.z = 2;
        this.add(this.camera);

        const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        const cubeMaterial = new THREE.MeshNormalMaterial({});

        this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        this.cube.name = "main-cube";
        this.add(this.cube);

        this.cameraMatUpdateCallback = ThreeApplication.createPerspectiveCameraResizer(this.renderer, this.camera);
        window.addEventListener("resize", this.cameraMatUpdateCallback);

    }

    public onInitialization = (params: Framework.InitializeParameters) => {

        this.managerKey = params.key;

    };

    public onDestruction = () => {

        window.removeEventListener("resize", this.cameraMatUpdateCallback);

    };

    public onUpdate = (params: Framework.UpdateParameters) => {

        this.cube.rotateX(params.deltaTime);
        this.cube.rotateZ(params.deltaTime);

        console.log(params.sceneTime);

        if (params.sceneTime > 3) {

            console.log("Poof!");
            this.sceneManager.delete("main-scene");

        }

    };

    public onRender = (params: Framework.RenderParameters) => {

        this.renderer.render(this, this.camera);

    };

}
