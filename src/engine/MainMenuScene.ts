import * as THREE from "three";
import * as Framework from "./framework/BaseScene";

import { ThreeApplication } from "./ThreeApplication";

export class MainMenuScene extends Framework.BaseScene {

    private readonly camera: THREE.PerspectiveCamera;
    private readonly button: THREE.Mesh;

    public constructor(params: Framework.BaseSceneParameters) {

        super(params);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.add(this.camera);

        const backgroundColor = new THREE.Color(0x0000ff);
		this.renderer.setClearColor(backgroundColor);
      
    }


    public onInitialization = (params: Framework.InitializeParameters) => {

        this.managerKey = params.key;
    
    };
    
    public onDestruction = () => {
    
    };
      
    public onUpdate = (params: Framework.UpdateParameters) => {
      
        // if () {
      
        //         this.sceneManager.setCurrent("main-scene");
      
        // }
      
    };

    public onRender = (params: Framework.RenderParameters) => {

        this.renderer.render(this, this.camera);

    };


}

