import * as THREE from "three";
import * as Framework from "./framework/BaseScene";

import { ThreeApplication } from "./ThreeApplication";

import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { KeyHandler } from "./framework/KeyHandler";

import { MainMenuScene } from "./MainMenuScene";

import { Grass } from "./environment/Grass";
import { Rocks } from "./environment/Rocks";
import { Ground } from "./environment/Ground";
import { Trees } from "./environment/Trees";
import { PhysicalLamps } from "./environment/PhysicalLamps";

import { Thunderstorm } from "./weather/Thunderstorm";

import { Player } from "./Player";

export class MainScene extends Framework.BaseScene {

    public static readonly WORLD_HEIGHT: number = 100;
    public static readonly WORLD_WIDTH:  number = 250;
    public static readonly WORLD_DEPTH:  number = 500;

    private readonly camera: THREE.PerspectiveCamera;

    private readonly ambientLight: THREE.AmbientLight;
    private readonly hemisphereLight: THREE.HemisphereLight;
    private readonly mainLight: THREE.DirectionalLight;

    private readonly rainCount: number = 200000;
    private readonly thunderstorm: Thunderstorm;

    private readonly ground: Ground;
    private readonly trees: Trees;
    private readonly grass: Grass;
    private readonly rocks: Rocks;
    private readonly lamps: PhysicalLamps;

    private readonly player: Player;

    private readonly cameraMatUpdateCallback: (e: UIEvent) => void;

    public constructor(params: Framework.BaseSceneParameters) {

        super(params);

        // PLAYER (CAT) //

        this.camera = new THREE.PerspectiveCamera(50, (innerWidth / innerHeight), 0.1, 1000.0);
        this.camera.name = "main-camera";
        this.camera.position.y = 3.0;
        this.camera.position.z = 4.0;
        this.camera.lookAt(new THREE.Vector3(0, 0.5, -5));

        this.player = new Player(this, this.camera);
        this.player.position.z = MainScene.WORLD_DEPTH / 2 - 15;
        this.add(this.player);

        // LIGHTING //

        this.ambientLight = new THREE.AmbientLight("rgb(69, 76, 86)", 0.5);
        this.add(this.ambientLight);

        const skyLight:    THREE.ColorRepresentation = 0x454c56;
        const groundLight: THREE.ColorRepresentation = 0x714e24;

        this.hemisphereLight = new THREE.HemisphereLight(skyLight, groundLight, 0.9);
        this.hemisphereLight.position.set(0, 100, 0);
        this.add(this.hemisphereLight);

        this.mainLight = new THREE.DirectionalLight("rgb(69, 76, 86)", 1);
        this.mainLight.position.set(0, 100, 0);
        this.mainLight.target.position.set(0, 0, 0);
        this.mainLight.castShadow = true;
        this.mainLight.shadow.bias = -0.004;
        this.mainLight.shadow.camera.near = 0.1;
        this.mainLight.shadow.camera.far = 1000;
        this.mainLight.shadow.camera.left = this.mainLight.shadow.camera.bottom = -1000;
        this.mainLight.shadow.camera.top = this.mainLight.shadow.camera.right = 1000;
        this.mainLight.shadow.mapSize.width = this.mainLight.shadow.mapSize.height = 1024;
        this.add(this.mainLight);

        // WEATHER //

        this.thunderstorm = new Thunderstorm(this.camera, this.rainCount);
        this.add(this.thunderstorm);

        this.fog = new THREE.Fog("rgb(50, 58, 66)", 1.0, 50.0);

        // GROUND AND FOLEY //

        const startLight = new THREE.SpotLight("rgb(120, 120, 82)", 10, 6, Math.PI, 4, 1.1);
        startLight.position.set(0, 2, 230);
        startLight.castShadow = true;
        this.add(startLight);

        this.ground = new Ground();
        this.add(this.ground);

        this.trees = new Trees(1000);
        this.add(this.trees);

        this.grass = new Grass(500000);
        this.add(this.grass);

        this.rocks = new Rocks(150);
        this.add(this.rocks);

        this.lamps = new PhysicalLamps();
        this.add(this.lamps);

        this.cameraMatUpdateCallback = ThreeApplication.createPerspectiveCameraResizer(this.renderer, this.camera);

        window.addEventListener("resize", this.cameraMatUpdateCallback);

    }

    public onDestruction = () => {

        window.removeEventListener("resize", this.cameraMatUpdateCallback);

    };

    public onUpdate = (params: Framework.UpdateParameters) => {
          
        if (KeyHandler.isKeyPressed("Escape")) {
            this.sceneManager.push(new MainMenuScene({
                renderer:     this.renderer,
                sceneManager: this.sceneManager,
            }));
        }

        // PLAYER //
        
        this.player.update(params.deltaTime);

        // WEATHER //

        this.thunderstorm.update(params.deltaTime);
        
        // GROUND AND FOLEY //

        this.grass.update(params.sceneTime);
    
    };

    public onRender = (params: Framework.RenderParameters) => {

        this.renderer.render(this, this.camera);

    };

}
