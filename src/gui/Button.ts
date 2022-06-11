import * as THREE from "three";

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

        const shapeGeometry = new THREE.PlaneGeometry(params.size.x, params.size.y, 10, 10);
        const shapeMaterial = new THREE.MeshPhongMaterial({
            color: "rgb(66, 66, 66)",
            transparent: true,
            opacity: 0.85,
            flatShading: true,
        });

        this.shape = new THREE.Mesh(shapeGeometry, shapeMaterial);
        this.shape.position.copy(params.position);
        this.add(this.shape);

        const shapePositions = shapeGeometry.attributes["position"];
        for (let i = 0; i < shapePositions.count; ++i) {

            if (i % 2) continue;
            shapePositions.setZ(i, shapePositions.getZ(i) - Math.random() / 10);

        }

        this.text = new THREE.Mesh();

        if (params.text === undefined) return;

        const fontLoader = new FontLoader();
        fontLoader.load(
            // "node_modules/three/examples/fonts/optimer_bold.typeface.json",
            "/resources/fonts/optimer_bold.typeface.json",
            (font: Font) => {

                const textGeometry = new TextGeometry(params.text as string, {
                    height: 0.01,
                    size: 0.10,
                    font: font,
                });
                const textMaterial = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                });

                const textSize = new THREE.Vector3();
                textGeometry.computeBoundingBox();
                textGeometry.boundingBox?.getSize(textSize);

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
