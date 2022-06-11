import * as THREE from "three";
import { MainScene } from "../MainScene";

import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export class Trees extends THREE.Group {

    private readonly GLTFLoader: GLTFLoader = new GLTFLoader();

    public constructor(count: number) {
        
        super();

        const treesTexture1 = new THREE.TextureLoader().load("/resources/textures/trees_background/lastlo1.png");
        const treesTexture2 = new THREE.TextureLoader().load("/resources/textures/trees_background/lastlo4.png");

        treesTexture1.wrapS = treesTexture1.wrapT = 
        treesTexture2.wrapS = treesTexture2.wrapT = THREE.RepeatWrapping;
        treesTexture1.repeat.set(15, 1);
        treesTexture2.repeat.set(15, 1);

        const treesMaterial1 = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            side: THREE.FrontSide,
            map: treesTexture1,
        });

        const treesMaterial2 = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            side: THREE.FrontSide,
            map: treesTexture2,
        });

        const treesBackground1 = new THREE.Mesh(new THREE.PlaneGeometry(MainScene.WORLD_DEPTH, 20), treesMaterial1);
        treesBackground1.position.set(20, 10, 0);
        treesBackground1.rotation.set(0, -(Math.PI / 2), 0);
        this.add(treesBackground1);

        const treesBackground2 = new THREE.Mesh(new THREE.PlaneGeometry(MainScene.WORLD_DEPTH, 20), treesMaterial2);
        treesBackground2.position.set(-20, 10, 0);
        treesBackground2.rotation.set(0, (Math.PI / 2), 0);
        this.add(treesBackground2);

        for(let i = 0; i < 1300; i++) {

            const Random110 = Math.floor(Math.random() * 10) + 1;
            
            this.GLTFLoader.load(
                
                "/resources/objects/trees/mesh/tree_" + Random110 + ".glb", 
                
                ( tree: GLTF ) => {
                    
                    const add = Math.random();
                    // const add = 0;
                    tree.scene.scale.set(5 + add, 5 + add, 5 + add);
                    tree.scene.rotation.y = Math.random() * Math.PI;
                    tree.scene.position.set(
                        Math.random() * 40 - 20,
                        Math.random() * (-1 - (-3) + 1) + (-3),
                        Math.random() * MainScene.WORLD_DEPTH - MainScene.WORLD_DEPTH / 2,
                    );

                    tree.scene.castShadow = true;
                    tree.scene.receiveShadow = true;
                    
                    const boundingBox = new THREE.Box3().setFromObject(tree.scene);
                    boundingBox.expandByScalar(-0.75);

                    if(tree.scene.position.x > 7 || tree.scene.position.x < -7) {
                        this.add(tree.scene);
                    }

                },
            
                ( event: ProgressEvent ) => { console.log((event.loaded / event.total) * 100 + "% loaded"); },
                ( event: ErrorEvent ) => { console.log(event); }
            );
        }
    }
}