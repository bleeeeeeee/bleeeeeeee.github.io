import * as THREE from "three";
import * as Framework from "./framework/BaseScene";

import { ThreeApplication } from "./ThreeApplication";

import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { KeyHandler } from "./framework/KeyHandler";

import { MainMenuScene } from "./MainMenuScene";

import { RainDroplets } from "./RainDroplets";
import { Grass } from "./environment/Grass";
import { Rocks } from "./environment/Rocks";
import { Ground } from "./environment/Ground";
import { Trees } from "./environment/Trees";
import { PhysicalLamps } from "./environment/PhysicalLamps";

export class MainScene extends Framework.BaseScene {

    public static readonly WORLD_HEIGHT: number = 100;
    public static readonly WORLD_WIDTH:  number = 250;
    public static readonly WORLD_DEPTH:  number = 500;

    private readonly GLTFLoader: GLTFLoader = new GLTFLoader();
    private readonly audioLoader: THREE.AudioLoader = new THREE.AudioLoader();

    private readonly camera: THREE.PerspectiveCamera;
    private readonly flashlight: THREE.SpotLight;
    private timeElapsedFlashlight: number;

    private readonly ambientLight: THREE.AmbientLight;
    private readonly hemisphereLight: THREE.HemisphereLight;
    private readonly mainLight: THREE.DirectionalLight;

    private readonly atmosphere: THREE.Mesh;
    private readonly audioListener: THREE.AudioListener;
    private readonly globalAudio: THREE.Audio;
    private readonly thunderstruckAudioBump: THREE.Audio;
    private readonly thunderstruckAudioDecay: THREE.Audio;
    private readonly rain: RainDroplets;
    private readonly rainCount: number = 200000;
    private readonly struckLight: THREE.PointLight;

    private readonly ground: Ground;
    private readonly trees: Trees;
    private readonly grass: Grass;
    private readonly rocks: Rocks;
    private readonly lamps: PhysicalLamps;

    private readonly player: THREE.Object3D;
    private animationMixer: THREE.AnimationMixer;

    private readonly cameraMatUpdateCallback: (e: UIEvent) => void;

    public constructor(params: Framework.BaseSceneParameters) {

        super(params);

        this.camera = new THREE.PerspectiveCamera(50, (innerWidth / innerHeight), 0.1, 1000.0);
        this.camera.name = "main-camera";
        this.camera.position.y = 3.0;
        this.camera.position.z = 4.0;
        this.camera.lookAt(new THREE.Vector3(0, 0.5, -5));

        this.flashlight = new THREE.SpotLight(0xffffff, 20, 20, Math.PI * 0.1, 0.2, 1);
        this.flashlight.position.set(0, 1, -1);
        this.flashlight.target.position.set(0, 0, -500);

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
        this.mainLight.shadow.mapSize.width = this.mainLight.shadow.mapSize.height = 2048;
        this.add(this.mainLight);

        this.audioListener = new THREE.AudioListener();
        this.camera.add(this.audioListener);

        this.globalAudio = new THREE.Audio(this.audioListener);

        this.audioLoader.load(
            "/resources/audio/rainfall.ogg", 
            (audioBuffer: AudioBuffer) => {
                this.globalAudio.setBuffer(audioBuffer);
                this.globalAudio.setLoop(true);
                this.globalAudio.setVolume(0.2);
                this.globalAudio.play();
            },
            ( event: ProgressEvent ) => { console.log((event.loaded / event.total) * 100 + "% loaded"); },
            ( event: ErrorEvent ) => { console.log(event); }
        );

        this.thunderstruckAudioBump = new THREE.Audio(this.audioListener);
        this.thunderstruckAudioDecay = new THREE.Audio(this.audioListener);

        this.struckLight = new THREE.PointLight("rgb(22, 22, 22)", 100, 500, 0.9);
        this.struckLight.position.set(0, 200, 0);
        this.add(this.struckLight);

        const atmosphereColor = new THREE.Color("rgb(52, 93, 109)");
        const atmosphereGeometry = new THREE.BoxGeometry(MainScene.WORLD_WIDTH, MainScene.WORLD_HEIGHT, MainScene.WORLD_DEPTH);
        const atmosphereMaterial = new THREE.MeshBasicMaterial({
            color: atmosphereColor,
            side: THREE.DoubleSide,
            opacity: 1,
            transparent: true,
        });

        this.atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        this.add(this.atmosphere);

        this.fog = new THREE.Fog("rgb(50, 58, 66)", 1.0, 50.0);

        this.rain = new RainDroplets("rgb(52, 78, 96", this.rainCount);
        this.add(this.rain);

        // GROUND AND FOLEY //

        const startLight = new THREE.SpotLight("rgb(120, 120, 82)", 10, 6, Math.PI, 4, 1.1);
        startLight.position.set(0, 2, 230);
       //startLight.target.position.set(0, 0, 0);
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
        
        // PLAYER (CAT) //

        const playerScale = 3.5;
        this.player = new THREE.Object3D();

        this.GLTFLoader.load(
            "/resources/objects/better-cat/cat_rigged.glb", 
            ( player: GLTF ) => {
                player.scene.scale.setScalar(playerScale);
                player.scene.rotation.y = Math.PI / 2;

                this.player.castShadow = true;
                this.player.receiveShadow = true;

                this.animationMixer = new THREE.AnimationMixer(player.scene);

                player.animations.forEach( ( clip ) => { this.animationMixer.clipAction( clip ).play(); });

                this.animationMixer.timeScale = 1.5;

                this.player.add(player.scene);

            },
            ( event: ProgressEvent ) => { console.log((event.loaded / event.total) * 100 + "% loaded"); },
            ( event: ErrorEvent ) => { console.log(event); }
        );

        // starting position !!! //
        this.player.position.z = MainScene.WORLD_DEPTH / 2 - 15;
        this.add(this.player);
        this.player.add(this.camera);
        this.player.add(this.flashlight);
        this.add(this.flashlight.target);

        this.cameraMatUpdateCallback = ThreeApplication.createPerspectiveCameraResizer(this.renderer, this.camera);

        window.addEventListener("resize", this.cameraMatUpdateCallback);

        this.timeElapsedFlashlight = 0;
        this.flashlight.visible = false;

    }

    public onDestruction = () => {

        window.removeEventListener("resize", this.cameraMatUpdateCallback);

    };

    public onUpdate = (params: Framework.UpdateParameters) => {
        
        const SPEED = 10;
        const distance = SPEED * params.deltaTime;

        if (KeyHandler.isKeyPressed("w")) {
            if(this.animationMixer) {
                this.animationMixer.update(params.deltaTime);
            }
            this.player.position.z -= distance;
        }

        if (KeyHandler.isKeyPressed("s"))           this.player.position.z += distance;
        if (KeyHandler.isKeyPressed("a"))           this.player.position.x -= distance;
        if (KeyHandler.isKeyPressed("d"))           this.player.position.x += distance;

        if (KeyHandler.isKeyPressed("ArrowUp"))     this.camera.rotation.x += distance * 0.5;
        if (KeyHandler.isKeyPressed("ArrowDown"))   this.camera.rotation.x -= distance * 0.5;
        if (KeyHandler.isKeyPressed("ArrowRight"))  this.camera.rotation.y -= distance * 0.5;
        if (KeyHandler.isKeyPressed("ArrowLeft"))   this.camera.rotation.y += distance * 0.5;

        if (KeyHandler.isKeyPressed("l") && this.timeElapsedFlashlight >= 1) {
            this.flashlight.visible = !this.flashlight.visible;
            this.timeElapsedFlashlight = 0;
        }
          
        if (KeyHandler.isKeyPressed("Escape")) {
            this.sceneManager.push(new MainMenuScene({
                renderer:     this.renderer,
                sceneManager: this.sceneManager,
            }));
        }
        this.timeElapsedFlashlight += params.deltaTime * 4;
        
        // RAIN, STRUCKLIGHTS AND THUNDERSTRUCKS //

        if(Math.random() > 0.98 || this.struckLight.power > 100) {

            if(this.struckLight.power < 100) 
                this.struckLight.position.set(Math.random() * 400, 300 + Math.random() * 200, 100);

            this.struckLight.power = 50 + Math.random() * 800;

            if(this.struckLight.power > 400) {
                if(this.struckLight.power > 500) {
                
                    if(!this.thunderstruckAudioBump.isPlaying) {
                        this.audioLoader.load("/resources/audio/thunder-struck-1.ogg", (audioBuffer: AudioBuffer) => {
                            this.thunderstruckAudioBump.setBuffer(audioBuffer);
                            this.thunderstruckAudioBump.setLoop(false);
                            this.thunderstruckAudioBump.setVolume(0.2);
                            this.thunderstruckAudioBump.play();
                        });
                    }
    
                }
                else if(!this.thunderstruckAudioDecay.isPlaying) {
                    this.audioLoader.load("/resources/audio/thunder-struck-2.ogg", (audioBuffer: AudioBuffer) => {
                        this.thunderstruckAudioDecay.setBuffer(audioBuffer);
                        this.thunderstruckAudioDecay.setLoop(false);
                        this.thunderstruckAudioDecay.setVolume(0.4);
                        this.thunderstruckAudioDecay.play();
                    });
                } 
            }
        }
        
        this.rain.position.y -= 0.35;

        if(this.rain.position.y < -Math.random() * 40) {
            this.rain.position.y = Math.random() * 40;
        }
        
        // GRASS MOVEMENT //

        this.grass.update(params.sceneTime);
    
    };

    public onRender = (params: Framework.RenderParameters) => {

        this.renderer.render(this, this.camera);

    };

}
