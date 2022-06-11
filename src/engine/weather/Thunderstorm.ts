import * as THREE from "three";
import { MainScene } from "../MainScene";

import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { RainDroplets } from "./RainDroplets";

export class Thunderstorm extends THREE.Group {

    private readonly GLTFLoader: GLTFLoader = new GLTFLoader();
    
    private readonly audioLoader: THREE.AudioLoader = new THREE.AudioLoader();
    private readonly audioListener: THREE.AudioListener = new THREE.AudioListener();
    
    private readonly rain: RainDroplets;
    private readonly struckLight: THREE.PointLight;
    private readonly thunderstruckAudioBump: THREE.Audio = new THREE.Audio(this.audioListener);
    private readonly thunderstruckAudioDecay: THREE.Audio = new THREE.Audio(this.audioListener);

    public constructor(camera: THREE.Camera, rainCount: number) {

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

        camera.add(this.audioListener);

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

    }

    public update = (time: number) => {

        this.rain.position.y -= 0.35;

        if(this.rain.position.y < -Math.random() * 40)
            this.rain.position.y = Math.random() * 40;

        if(Math.random() > 0.98 || this.struckLight.power > 100) {

            if(this.struckLight.power < 100) 
                this.struckLight.position.set(Math.random() * 400, 300 + Math.random() * 200, 100);

            this.struckLight.power = 50 + Math.random() * 800;

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

    };
}