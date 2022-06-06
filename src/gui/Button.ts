// Beware of the horrifying line below!
// TODO: either write typescript definitions file for troika-three-text or find a better way to implement text rendering.
// @ts-nocheck

import * as THREE from "three";

import { Text } from "troika-three-text";

export interface ButtonParameters {

    position: THREE.Vector3;
    size: THREE.Vector2;

    text?: string;
    fontSize?: number;
    fontColor?: string;

}

export class Button extends THREE.Group {

    private readonly shape: THREE.Mesh;
    private readonly text: Text;

    public constructor(params: ButtonParameters) {

        super();

        const shapeGeometry = new THREE.PlaneGeometry(params.size.x, params.size.y, 1, 1);
        const shapeMaterial = new THREE.MeshBasicMaterial({
            color: "rgb(66, 66, 66)",
            transparent: true,
            alphaMap: null,
        });

        this.shape = new THREE.Mesh(shapeGeometry, shapeMaterial);
        this.shape.position.copy(params.position);
        this.add(this.shape);

        this.text = new Text();

        this.text.text      = params.text || "";
        this.text.fontSize  = params.fontSize || 5;
        this.text.color     = params.fontColor || "0x000000";
        // this.text.textAlign = "center";
        this.text.maxWidth  = params.size.x;
        this.text.anchorX   = params.size.x / 2 - (this.text.text.length == 4 ? 4.8 : 3.2);
        this.text.anchorY   = -params.position.y - params.size.y / 2 + 0.18;

        this.add(this.text);
        
    }

}
