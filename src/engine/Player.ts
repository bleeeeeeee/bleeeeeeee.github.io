import * as THREE from "three";

import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { KeyHandler } from "./framework/KeyHandler";

export class Player extends THREE.Object3D {

    public static readonly HEALTH: number;
    public static readonly HUNGER: number;
    public static readonly SCORE:  number;

    private readonly GLTFLoader: GLTFLoader = new GLTFLoader();

    private animationMixer: THREE.AnimationMixer;
    private readonly flashlight: THREE.SpotLight;
    private timeElapsedFlashlight = 0;

    private onKeyDown = (event: KeyboardEvent) => {

        switch (event.key) {

            case "d": {

                if (this.position.x < 2)
                    this.position.x += 2;

            } break;

            case "a": {

                if (this.position.x > -2)
                    this.position.x -= 2;

            } break;

        }

    };

    public constructor(_mainScene: THREE.Scene, camera: THREE.PerspectiveCamera) {

        super();

        const playerScale = 3.5;

        this.GLTFLoader.load(

            "/resources/objects/better-cat/cat_rigged.glb", 

            ( player: GLTF ) => {
                player.scene.scale.setScalar(playerScale);
                player.scene.rotation.y = Math.PI / 2;

                this.castShadow = true;
                this.receiveShadow = true;

                this.animationMixer = new THREE.AnimationMixer(player.scene);

                player.animations.forEach( ( clip ) => { this.animationMixer.clipAction( clip ).play(); });

                this.animationMixer.timeScale = 1.5;

                this.add(player.scene);

            },

            ( event: ProgressEvent ) => { console.log((event.loaded / event.total) * 100 + "% loaded"); },
            
            ( event: ErrorEvent ) => { console.log(event); }
        );

        this.flashlight = new THREE.SpotLight(0xffffff, 20, 20, Math.PI * 0.1, 0.2, 1);
        this.flashlight.position.set(0, 1, -1);
        this.flashlight.target.position.set(0, 0, -500);

        this.add(camera, this.flashlight);
        _mainScene.add(this.flashlight.target);
        this.flashlight.visible = false;

        document.addEventListener("keydown", this.onKeyDown);

    }
    
    public update = (time: number) => {

        const SPEED = 10;
        const distance = SPEED * time;

        if (KeyHandler.isKeyPressed("w")) {
            if(this.animationMixer) {
                this.animationMixer.update(time);
            }
            // this.position.x = 0;
            this.position.z -= distance;
        }

        // if (KeyHandler.isKeyPressed("a")) this.position.x = -2;
        // if (KeyHandler.isKeyPressed("d")) this.position.x = 2;

        if (KeyHandler.isKeyPressed("l") && this.timeElapsedFlashlight >= 1) {
            this.flashlight.visible = !this.flashlight.visible;
            this.timeElapsedFlashlight = 0;
            console.log("Flashlight: " + this.flashlight.visible);
        }

        this.timeElapsedFlashlight += time * 4;

    };

}