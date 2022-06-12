import * as THREE from "three";
import { MainScene } from "../MainScene";

import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export class PhysicalLamps extends THREE.Group {

    private readonly GLTFLoader: GLTFLoader = new GLTFLoader();

    public constructor() {
        super();

        for(let i = 200; i > -250; i -= 50) {

            const foleyLight = new THREE.SpotLight("rgb(31, 56, 82)", 20, 10, Math.PI, 4, 1.25);
            foleyLight.target.position.set(0, 0, 0);
            foleyLight.castShadow = true;
            foleyLight.position.set(0, 2, i);

            this.add(foleyLight);

            this.GLTFLoader.load(
                
                "/resources/objects/lamp/lamp-1.glb",
                
                ( lampGLTF: GLTF ) => {
                    
                    lampGLTF.scene.scale.setScalar(3);
                    lampGLTF.scene.rotation.y = Math.PI / 2;
                    lampGLTF.scene.position.set(-4, 0, i);
                    lampGLTF.scene.castShadow = true;
                    lampGLTF.scene.receiveShadow = true;
    
                    this.add(lampGLTF.scene);
                },
            
                ( event: ProgressEvent ) => { console.log((event.loaded / event.total) * 100 + "% loaded"); },
                
                ( event: ErrorEvent ) => { console.error(event); }
            
            );
        }
    
    }
}