// Beware of the horrifying line below!
// TODO: either write typescript definitions file for troika-three-text or find a better way to implement text rendering.

import * as THREE from "three";

// import { Text } from "troika-three-text";

import { TTFLoader } from "three/examples/jsm/loaders/TTFLoader";
import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry, TextGeometryParameters } from "three/examples/jsm/geometries/TextGeometry";

export interface ButtonParameters {

    position: THREE.Vector3;
    size: THREE.Vector2;

    text?: string;
    fontSize?: number;
    fontColor?: string;

}

export class Button extends THREE.Group {

    private readonly shape: THREE.Mesh;
    private text: THREE.Mesh;

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

        this.text = new THREE.Mesh();

        if (params.text === undefined) return;

        const fontLoader = new FontLoader();
        fontLoader.load(
            "node_modules/three/examples/fonts/helvetiker_regular.typeface.json",
            (font: Font) => {
                const textGeometry = new TextGeometry(params.text as string, {
                    height: 0.01,
                    size: 0.10,
                    font: font,
                });
                const textMaterial = new THREE.MeshBasicMaterial({
                    color: 0xffffff
                });

                const textSize = new THREE.Vector3();
                textGeometry.computeBoundingBox();
                textGeometry.boundingBox?.getSize(textSize);

                // const newPositionX = params.position.x + (shapeGeometry.parameters.width / 2 - textSize.x / 2);
                // const newPositionY = params.position.y + (shapeGeometry.parameters.height / 2 - textSize.y / 2);

                const newPositionX = params.position.x - (textSize.x / 2);
                const newPositionY = params.position.y - (textSize.y / 2);

                this.text.geometry = textGeometry;
                this.text.material = textMaterial;

                this.text.position.set(newPositionX, newPositionY, 0);
                this.text.name = "text";
                this.add(this.text);
            },
            () => {},
            (error: ErrorEvent) => console.error("Failed to load the font: " + error.message),
        );
        
    }

}
