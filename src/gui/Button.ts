import * as THREE from "three";

import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader";

export interface ButtonParameters {

    position: THREE.Vector3;
    size: THREE.Vector2;

    text?: string;
    fontSize?: number;
    fontColor?: THREE.ColorRepresentation;

}

export class Button extends THREE.Group {

    private readonly shape: THREE.Mesh;
    private readonly text: THREE.Mesh;

    public constructor(params: ButtonParameters) {

        super();

        const shapeGeometry = new THREE.PlaneGeometry(params.size.x, params.size.y, 1, 1);
        const shapeMaterial = new THREE.MeshBasicMaterial({
            color: "rgb(255, 255, 255)",
        });

        this.shape = new THREE.Mesh(shapeGeometry, shapeMaterial);
        this.shape.position.copy(params.position);
        this.add(this.shape);

        let textGeometry: TextGeometry | undefined = undefined;
        let textMaterial: THREE.MeshBasicMaterial | undefined = undefined;

        const loader = new FontLoader();
        loader.load("resources/fonts/example_font.json", (font: Font) => {

            textGeometry = new TextGeometry(params.text ?? "", {
                font: font,
                size: params.fontSize ?? 80,
                height: 5,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 10,
                bevelSize: 8,
                bevelOffset: 0,
                bevelSegments: 5,
            });

            textMaterial = new THREE.MeshBasicMaterial({
                color: params.fontColor ?? 0xffffff,
            });

        }, () => {}, () => console.log("Failed to load the font!"));

        this.text = new THREE.Mesh(textGeometry, textMaterial);
        this.text.position.z = 0;
        this.add(this.text);

    }

}
