import * as THREE from "three";
import { MainScene } from "../MainScene";

export class Ground extends THREE.Mesh {

    public constructor() {

        const gtDIFF   = new THREE.TextureLoader().load("/resources/textures/betterground/COL_1K.png");
        const gtNRM    = new THREE.TextureLoader().load("/resources/textures/betterground/NRM_1K.png");
        const gtAO     = new THREE.TextureLoader().load("/resources/textures/betterground/AO_1K.png");

        gtDIFF.wrapS = gtDIFF.wrapT = gtNRM.wrapS = gtNRM.wrapT =
        gtAO.wrapS   = gtAO.wrapT   = THREE.RepeatWrapping;

        const groundRepeatVectorS = 30;
        const groundRepeatVectorT = 2 * groundRepeatVectorS;

        gtDIFF.repeat.set(groundRepeatVectorS, groundRepeatVectorT);
        gtNRM.repeat.set(groundRepeatVectorS, groundRepeatVectorT);
        gtAO.repeat.set(groundRepeatVectorS, groundRepeatVectorT);

        const xOffset = .5;
        const yOffset = .25;  

        gtDIFF.offset.set(xOffset, yOffset);
        gtNRM.offset.set(xOffset, yOffset);
        gtAO.offset.set(xOffset, yOffset);

        const groundMaterial = new THREE.MeshPhysicalMaterial({
            color: "rgb(41, 45, 60)",
            map: gtDIFF,
            normalMap: gtNRM,
            normalMapType: THREE.TangentSpaceNormalMap,
            normalScale: new THREE.Vector2(2, 2),
            aoMap: gtAO,
            aoMapIntensity: 10,
            side: THREE.FrontSide,
            shadowSide: THREE.FrontSide,
        });

        const groundGeometry = new THREE.PlaneGeometry(MainScene.WORLD_WIDTH, MainScene.WORLD_DEPTH, 100, 100);

        super(groundGeometry, groundMaterial);
        this.receiveShadow = true;
        this.castShadow = true;
        this.rotation.x = -Math.PI / 2;

    }
}