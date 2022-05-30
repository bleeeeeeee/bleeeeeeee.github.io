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

        const text = new Text();

        text.text       = params.text || "";
        text.fontSize   = params.fontSize || 5;
        text.color      = params.fontColor || "0x000000";
        // text.textAlign  = "center";
        text.maxWidth   = params.size.x;
        
        if(text.text.length == 4) {
            text.anchorX    = params.size.x / 2 - 4.8;
        }
        else {
            text.anchorX    = params.size.x / 2 - 3.2;
        }
        
        text.anchorY    = -params.position.y - params.size.y / 2 + 0.18;

        console.log(text.text.length);
        this.add(text);
    }

}
