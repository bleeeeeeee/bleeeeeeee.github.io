import * as THREE from "three";
import { MainScene } from "../MainScene";

import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { RainDroplets } from "./RainDroplets";

import { Player } from "../Player";

export class Thunderstorm extends THREE.Group {

    private readonly GLTFLoader: GLTFLoader = new GLTFLoader();

    private readonly audioLoader: THREE.AudioLoader = new THREE.AudioLoader();
    private readonly audioListener: THREE.AudioListener = new THREE.AudioListener();
    private readonly audioListenerBump: THREE.AudioListener = new THREE.AudioListener();
    private readonly audioListenerDecay: THREE.AudioListener = new THREE.AudioListener();
    
    private readonly rain: RainDroplets;
    private readonly struckLight: THREE.PointLight;
    private readonly struckLightDirect: THREE.PointLight;
    private readonly thunderstruckAudioBump: THREE.Audio = new THREE.Audio(this.audioListenerBump);
    private readonly thunderstruckAudioDecay: THREE.Audio = new THREE.Audio(this.audioListenerDecay);

    private readonly _Player: Player;
    private readonly struckPhysical: THREE.Object3D;
    private PROBABILITY       = 20;    
    private probabilityCount  = 0;

    public constructor(camera: THREE.PerspectiveCamera, rainCount: number, player: Player) {

        super();

        const atmosphereColor = new THREE.Color("rgb(52, 93, 109)");
        const atmosphereGeometry = new THREE.BoxGeometry(MainScene.WORLD_WIDTH, MainScene.WORLD_HEIGHT, MainScene.WORLD_DEPTH);
        const atmosphereMaterial = new THREE.MeshBasicMaterial({
            color: atmosphereColor,
            side: THREE.DoubleSide,
            opacity: 1,
            transparent: true,
        });

        const atmosphereVolume = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        this.add(atmosphereVolume);

        this.rain = new RainDroplets("rgb(52, 78, 96", rainCount);
        this.add(this.rain);

        camera.add(this.audioListener, this.audioListenerBump, this.audioListenerDecay);

        const globalAudio = new THREE.Audio(this.audioListener);
        this.audioLoader.load(
            "/resources/audio/rainfall.ogg", 
            (audioBuffer: AudioBuffer) => {
                globalAudio.setBuffer(audioBuffer);
                globalAudio.setLoop(true);
                globalAudio.setVolume(0.15);
                globalAudio.play();
            },
            ( event: ProgressEvent ) => { console.log((event.loaded / event.total) * 100 + "% loaded"); },
            ( event: ErrorEvent ) => { console.log(event); }
        );

        this.struckLight = new THREE.PointLight("rgb(22, 22, 22)", 100, 500, 0.9);
        this.struckLight.position.set(0, 200, 0);
        this.add(this.struckLight);

        this.struckLightDirect = new THREE.PointLight("rgb(22, 22, 22)", 250, 500, 0.9);
        this.struckLightDirect.position.set(0, 200, 0);
        this.struckLightDirect.visible = false;
        
        this.struckPhysical = new THREE.Object3D();
        this.struckPhysical.add(this.struckLightDirect);
        this.struckPhysical.visible = false;

        this._Player = player;

        // LIGHTNING MODEL //
        
        this.GLTFLoader.load(
                
            "/resources/objects/lightning/model.glb", 
            
            ( _lightning: GLTF ) => {

                _lightning.scene.position.set(0.5, 5, 0);
                _lightning.scene.castShadow     = false;
                _lightning.scene.receiveShadow  = true;
                
                const boundingBox = new THREE.Box3().setFromObject(_lightning.scene);
                boundingBox.expandByScalar(-0.25);

                this.struckPhysical.add(_lightning.scene);

            },
        
            ( event: ProgressEvent ) => { console.log((event.loaded / event.total) * 100 + "% loaded"); },
            ( event: ErrorEvent ) => { console.log(event); }
        );

        this.struckPhysical.visible = false;
        this.add(this.struckPhysical);
    }

    public update = (time: number) => {

        this.rain.position.y -= 0.35;

        if(this.rain.position.y < -Math.random() * 40)
            this.rain.position.y = Math.random() * 40;

        if(Math.random() > 0.98 || this.struckLight.power > 100) {

            if(this.struckLight.power < 100) 
                this.struckLight.position.set(Math.random() * 400, 300 + Math.random() * 200, 100);

            this.struckLight.power = 50 + Math.random() * 800;

            if(!this.thunderstruckAudioDecay.isPlaying) {
                this.audioLoader.load("/resources/audio/thunder-struck-1.ogg", (audioBuffer: AudioBuffer) => {
                    this.thunderstruckAudioBump.setBuffer(audioBuffer);
                    this.thunderstruckAudioBump.setLoop(false);
                    this.thunderstruckAudioBump.setVolume(0.3);
                    this.thunderstruckAudioBump.play();
                });
            }

            if(!this.thunderstruckAudioBump.isPlaying) {
                this.audioLoader.load("/resources/audio/thunder-struck-2.ogg", (audioBuffer: AudioBuffer) => {
                    this.thunderstruckAudioDecay.setBuffer(audioBuffer);
                    this.thunderstruckAudioDecay.setLoop(false);
                    this.thunderstruckAudioDecay.setVolume(0.4);
                    this.thunderstruckAudioDecay.play();
                });
            }
        }
        
        // if( this.probabilityCount > this.PROBABILITY) {

        //     this.struckPhysical.position.set(this._Player.position.x, 0, this._Player.position.z - 1);
        //     this.struckLightDirect.position.set(0, 200, this._Player.position.z - 5);

        //     this.struckPhysical.visible     = true;
        //     this.struckLightDirect.visible  = true;
        //     this.probabilityCount           = 0;

        // } else {

        //     this.struckPhysical.visible     = false;
        //     this.struckLightDirect.visible  = false;
        // }

        // if(this._Player.position.z % 40 === 0) {
        //     this.PROBABILITY -= 1;
        // }

        // const add = Math.random() * (0.2 - 0.01) + (0.01);
        // this.probabilityCount += add;
        // console.log(add);

    };
}