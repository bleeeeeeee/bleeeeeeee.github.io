import * as THREE from "three";
import { MainScene } from "./MainScene";

import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export class Thunderstorm extends THREE.Object3D {
    
    public constructor(camera: THREE.Camera, rainCount: number) {
        super();

    }
}