import * as THREE from "three";
import { MainScene } from "../MainScene";

import vertexGLSL from "../shaders/grass_vertex.glsl";
import fragmentGLSL from "../shaders/grass_fragment.glsl";

export class Grass extends THREE.InstancedMesh {

    private readonly grassShader: THREE.ShaderMaterial;

    public constructor(instanceNumber: number) {

        const _grassShader = new THREE.ShaderMaterial();

        const grassUniforms = { 
            time:     { type: "f", value: 0.0 },
            fogColor: { type: "c", value: new THREE.Color(0xffffff) },
            fogNear:  { type: "f", value: 1.0 },
            fogFar:   { type: "f", value: 40.0 },
        };

        _grassShader.setValues({
            uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib["fog"],
                grassUniforms,
            ]),
            vertexShader: vertexGLSL,
            fragmentShader: fragmentGLSL,
            side: THREE.DoubleSide,
        });

        _grassShader.fog = true;

        const grassPoint = new THREE.Object3D();
        const geometry = new THREE.PlaneGeometry(0.01, 0.2, 1, 2);
        geometry.translate( 0, 0.5, 0 );

        super(geometry, _grassShader, instanceNumber);
        this.grassShader = _grassShader;

        this.position.set(0, -0.1, 0);
      
        for (let i = 0 ; i < instanceNumber; i++) {

            grassPoint.position.set(
                ( Math.random() ) * 30 - 15,
                0,
                ( Math.random() ) * MainScene.WORLD_DEPTH - MainScene.WORLD_DEPTH / 2
            );
            
            grassPoint.scale.setScalar( 0.5 + Math.random() * 0.5 );
            
            grassPoint.rotation.y = Math.random() * Math.PI;
            grassPoint.castShadow = true;
            grassPoint.receiveShadow = true;

            grassPoint.updateMatrix();
            this.setMatrixAt( i, grassPoint.matrix );

        }
    }

    public update = (time: number) => {

        this.grassShader.uniforms.time.value = time / 2;
        this.grassShader.uniformsNeedUpdate = true;

    };
}
