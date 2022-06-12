import * as THREE from "three";
import { MainScene } from "../MainScene";

import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export class Rocks extends THREE.Group {

    private readonly GLTFLoader: GLTFLoader = new GLTFLoader();

    public constructor(count: number) {
        
        super();

        for(let i = 0; i < count; i++) {

            const Random15 = Math.floor(Math.random() * (5 - 1 + 1) + (1));
            
            this.GLTFLoader.load(
                
                "/resources/objects/rocks/rock-" + Random15 + ".glb", 
                
                ( rock: GLTF ) => {
                    
                    rock.scene.scale.setScalar(0.075);
                    rock.scene.rotation.y = Math.random() * Math.PI;
                    rock.scene.position.set(
                        Math.random() * 10 - 5,
                        -0.2,
                        Math.random() * MainScene.WORLD_DEPTH - MainScene.WORLD_DEPTH / 2,
                    );

                    rock.scene.castShadow = true;
                    rock.scene.receiveShadow = true;

                    this.add(rock.scene);

                },
            
                ( event: ProgressEvent ) => { console.log((event.loaded / event.total) * 100 + "% loaded"); },
                
                ( event: ErrorEvent ) => { console.log(event); }
            
            );
        }

        this.GLTFLoader.load(
            "/resources/objects/rocks/rock-3.glb", 
            ( rock: GLTF ) => {
                rock.scene.scale.setScalar(4);
                rock.scene.position.set(
                    -15,
                    -0.2,
                    -(MainScene.WORLD_DEPTH / 2),
                );

                rock.scene.castShadow = true;
                rock.scene.receiveShadow = true;

                this.add(rock.scene);
            },
            ( event: ProgressEvent ) => { console.log((event.loaded / event.total) * 100 + "% loaded"); },
            ( event: ErrorEvent ) => { console.log(event); }
        );

        this.GLTFLoader.load(
            "/resources/objects/rocks/rock-4.glb", 
            ( rock: GLTF ) => {
                rock.scene.scale.setScalar(4);
                rock.scene.position.set(
                    10,
                    -0.2,
                    -(MainScene.WORLD_DEPTH / 2) - 10,
                );

                rock.scene.castShadow = true;
                rock.scene.receiveShadow = true;

                this.add(rock.scene);
            },
            ( event: ProgressEvent ) => { console.log((event.loaded / event.total) * 100 + "% loaded"); },
            ( event: ErrorEvent ) => { console.log(event); }
        );
    }
}
