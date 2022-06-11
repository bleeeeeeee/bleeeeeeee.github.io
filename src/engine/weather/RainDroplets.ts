import * as THREE from "three";
import { MainScene } from "../MainScene";

export class RainDroplets extends THREE.Points {

    private static createGeometry = (count: number): THREE.BufferGeometry => {

        const droplets: THREE.Vector3[] = [];

        for (let i = 0; i < count; ++i) {
            const dropletPosition = new THREE.Vector3(
                Math.random() * 70 - 35,
                Math.random() * 200 - 100,
                Math.random() * MainScene.WORLD_DEPTH - MainScene.WORLD_DEPTH / 2,
            );
            droplets.push(dropletPosition);
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(droplets);
        return geometry;

    };

    public constructor(color: THREE.ColorRepresentation, dropletsCount: number) {

        const geometry = RainDroplets.createGeometry(dropletsCount);
        const material = new THREE.PointsMaterial({
            color: color,
            size: 0.1,
            transparent: true,
            opacity: 1,
            fog: true,
        });

        super(geometry, material);

    }

}
