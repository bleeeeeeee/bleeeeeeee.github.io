import * as THREE from "three";
import * as Framework from "./framework/BaseScene";

import { ThreeApplication } from "./ThreeApplication";

import { KeyHandler } from "./framework/KeyHandler";

import { MainMenuScene } from "./MainMenuScene";

import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";

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

    private readonly stars: THREE.Group[] = [];
    private readonly cans: THREE.Group[] = [];

    private readonly player: Player;

    private readonly OBJLoader1: OBJLoader = new OBJLoader();
    private readonly OBJLoader2: OBJLoader = new OBJLoader();
    private readonly MTLLoader: MTLLoader = new MTLLoader();

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

        this.thunderstorm = new Thunderstorm(this.camera, this.rainCount, this.player);
        this.add(this.thunderstorm);

        this.fog = new THREE.Fog("rgb(50, 58, 66)", 1.0, 50.0);

        // GROUND AND FOLEY //

        const startLight = new THREE.SpotLight("rgb(120, 120, 82)", 10, 6, Math.PI, 4, 1.1);
        startLight.position.set(0, 2, 230);
        startLight.castShadow = true;
        this.add(startLight);

        this.ground = new Ground();
        this.add(this.ground);

        this.trees = new Trees(750);
        this.add(this.trees);

        this.grass = new Grass(250000);
        this.add(this.grass);

        this.rocks = new Rocks(100);
        this.add(this.rocks);

        this.lamps = new PhysicalLamps();
        this.add(this.lamps);

        // STARS //

        const randomElem = <T>(elements: T[]): T =>
            elements[Math.floor(Math.random() * elements.length)];

        const starLight = new THREE.SpotLight("rgb(120, 120, 82)", 30, 3, Math.PI, 2, 0.75);

        this.MTLLoader.load(
            "/resources/objects/_stars/star.mtl", 
            (starMaterial: MTLLoader.MaterialCreator) => {

				starMaterial.preload();
				this.OBJLoader1.setMaterials(starMaterial);

                this.OBJLoader1.load(
                    "/resources/objects/_stars/star.obj",
                    (star: THREE.Group) => {
                    
                        star.scale.setScalar(0.2);
        
                        for (let i = 215; i > -190; i -= 25) {

                            const starClone = star.clone();
                            starClone.position.set(randomElem([-2, 0, 2]), 0.75, i);

                            this.add(starClone);
                            starClone.add(starLight.clone());
                        }
        
                    },
                
                    () => {},
                    (event: ErrorEvent) => console.error(event)
                );
            }
        );

        // HUNGER //

        const canLight = new THREE.SpotLight("rgb(193, 40, 0)", 30, 4, Math.PI, 0.5, 0.5);

        this.MTLLoader.load( 

            "/resources/objects/_can/can.mtl", 
            
            ( canMaterial: MTLLoader.MaterialCreator ) => {

				canMaterial.preload();

				this.OBJLoader2.setMaterials( canMaterial ),

                this.OBJLoader2.load(
                
                    "/resources/objects/_can/can.obj",

                    ( can: THREE.Group ) => {
                    
                        can.position.set(0, 0.8, 0);
                        can.scale.setScalar(0.75);
                        
                        let change = Math.random() * (35 - 25) + 25;

                        for(let i = 185; i > -210; i -= change) {
                            const Random100 = Math.random();
                            const _canClone = can.clone();
                            const _canLightClone = canLight.clone();

                            _canClone.position.set(0, 0, i);
                            _canLightClone.position.set(0, 3, i);

                            if(Random100 < 0.33) {
                                _canClone.position.x = _canLightClone.position.x = 2;
                                this.add(_canClone, _canLightClone);
                            } else if(Random100 > 0.67) {
                                _canClone.position.x = _canLightClone.position.x = -2;
                                this.add(_canClone, _canLightClone);
                            } else {
                                _canClone.position.x = _canLightClone.position.x = 0;
                                this.add(_canClone, _canLightClone);
                            }

                            change = Math.random() * (35 - 25) + 25;
                        }
        
                    },
                
                    ( event: ProgressEvent ) => { console.log((event.loaded / event.total) * 100 + "% loaded"); },
                    ( event: ErrorEvent ) => { console.log(event); }
                );
            }
        );

        //

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

        // STARS AND HUNGER //
    
    };

    public onRender = (params: Framework.RenderParameters) => {

        this.renderer.render(this, this.camera);

    };

}
