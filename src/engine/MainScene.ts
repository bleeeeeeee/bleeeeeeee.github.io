import * as THREE from "three";
import * as Framework from "./framework/BaseScene";

import { ThreeApplication } from "./ThreeApplication";

import { KeyHandler } from "./framework/KeyHandler";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { MainMenuScene } from "./MainMenuScene";
import { EndMenuScene } from "./EndMenuScene";

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

    private readonly GLTFLoader: GLTFLoader = new GLTFLoader();

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
    public readonly heart: THREE.Sprite = new THREE.Sprite();
    public readonly can:   THREE.Sprite = new THREE.Sprite();

    private readonly OBJLoader1: OBJLoader = new OBJLoader();
    private readonly OBJLoader2: OBJLoader = new OBJLoader();
    private readonly MTLLoader: MTLLoader  = new MTLLoader();

    private readonly cameraMatUpdateCallback: (e: UIEvent) => void;

    public restart = () => {

        this.player.position.z = MainScene.WORLD_DEPTH / 2 - 15;
        this.player.position.x = 0;

        this.stars.forEach((star: THREE.Group) => {

            if (star.position.y == -10)
                star.position.y = 0.75;

        });

        this.cans.forEach((can: THREE.Group) => {

            if (can.position.y == -10)
                can.position.y = 0.0;

        });

        this.heart.material.opacity = 1;
        this.can.material.opacity = 1;

    };

    public constructor(params: Framework.BaseSceneParameters) {

        super(params);

        this.camera = new THREE.PerspectiveCamera(50, (innerWidth / innerHeight), 0.1, 1000.0);
        this.camera.name = "main-camera";
        this.camera.position.y = 3.0;
        this.camera.position.z = 4.0;
        this.camera.lookAt(new THREE.Vector3(0, 0.5, -5));

        this.player = new Player(this, this.camera);
        this.player.position.z = MainScene.WORLD_DEPTH / 2 - 15;
        this.add(this.player);

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

        for(let i = 215; i > -190; i -= 25) {
            
            this.GLTFLoader.load(
                
                "/resources/objects/stars/star.glb", 
                
                (star: GLTF) => {
                    
                    star.scene.scale.setScalar(0.2);
                    star.scene.position.set(randomElem([-2, 0, 2]), 0.75, i);

                    this.add(star.scene);
                    star.scene.add(starLight.clone());
                    this.stars.push(star.scene);

                },
                () => {},
                (event: ErrorEvent) => console.error(event)
            );
        }

        // HUNGER //

        const canLight = new THREE.SpotLight("rgb(255, 128, 128)", 30, 3, Math.PI, 2, 0.75);

        let change = Math.random() * (35 - 25) + 25;
        for(let i = 185; i > -210; i -= change, change = Math.random() * (35 - 25) + 25) {
            
            this.GLTFLoader.load(
                
                "/resources/objects/can/can.glb", 
                
                (can: GLTF) => {

                    can.scene.scale.setScalar(0.75);
                    can.scene.position.set(randomElem([-2, 0, 2]), 0.6, i);

                    this.add(can.scene);
                    can.scene.add(canLight.clone());
                    this.cans.push(can.scene);

                },

                () => {},
                
                (event: ErrorEvent) => console.error(event)
            );
        }

        //

        const heartSprite   = new THREE.TextureLoader().load("/resources/sprites/heart.png");
        const heartMaterial = new THREE.SpriteMaterial({ map: heartSprite });
        
        this.heart = new THREE.Sprite(heartMaterial);
        this.heart.position.set(-0.55, 1.55, 2);
        this.heart.scale.setScalar(0.25);
        this.player.add(this.heart);

        const canSprite   = new THREE.TextureLoader().load("/resources/sprites/can.png");
        const canMaterial = new THREE.SpriteMaterial({ map: canSprite });
        
        this.can = new THREE.Sprite(canMaterial);
        this.can.position.set(0.55, 1.55, 2);
        this.can.scale.setScalar(0.3);
        this.player.add(this.can);

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
                onRestart:    this.restart,
            }));
        }

        // PLAYER //
        
        this.player.update(params.deltaTime);

        // WEATHER //

        this.thunderstorm.update(params.deltaTime);
        
        // GROUND AND FOLEY //

        this.grass.update(params.sceneTime);

        // STARS AND HUNGER //

        const playerBoundingBox = new THREE.Box3().setFromObject(this.player);

        this.stars.forEach((star: THREE.Group) => {

            if (star.position.y != -10)
                star.position.y = 0.75 + Math.abs(Math.sin(params.totalTime / 1000) / 2);
                
            if (playerBoundingBox.intersectsBox(new THREE.Box3().setFromObject(star))) {
                star.position.y = -10;
                // this.stars.splice(this.stars.indexOf(star), 1);
            }

        });

        this.cans.forEach((can: THREE.Group) => {

            if (can.position.y != -10)
                can.position.y = 0.45 + Math.abs(Math.sin(params.totalTime / 1000) / 2);

            if (playerBoundingBox.intersectsBox(new THREE.Box3().setFromObject(can))) {
                can.position.y = -10;
                // this.cans.splice(this.cans.indexOf(can), 1);
                this.can.material.opacity = 1;
                this.heart.material.opacity = 1;
            }

        });

        if(this.can.material.opacity <= 0)
            this.heart.material.opacity -= 0.005;

        this.can.material.opacity   -= 0.007;


        if(this.heart.material.opacity <= 0) {
            this.sceneManager.push(new EndMenuScene({
                renderer:     this.renderer,
                sceneManager: this.sceneManager,
                onRestart:    this.restart,
            }));
        }

        if(this.player.position.z <= -MainScene.WORLD_DEPTH * 2 + 50)
            this.restart();
    };

    public onRender = (params: Framework.RenderParameters) => {

        this.renderer.render(this, this.camera);

    };

}
