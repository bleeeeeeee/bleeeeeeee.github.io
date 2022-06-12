import * as THREE from "three";
import * as Framework from "./framework/BaseApplication";

import { MainScene } from "./MainScene";
import { MainMenuScene } from "./MainMenuScene";

export class ThreeApplication extends Framework.BaseApplication {

    /**
     * Static method which returns window resize event callback,
     * handy when needed, instead of writing everywhere own method
     * for that, use that one instead.
     * 
     * @param renderer 
     * @param camera 
     * @returns window resize event callback, which updates renderer and camera
     */
     public static createPerspectiveCameraResizer = (renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera) => {

        return (_e: UIEvent) => {

            camera.aspect = (innerWidth / innerHeight);
            camera.updateProjectionMatrix();

            renderer.setSize(innerWidth, innerHeight);
        };

    };

    // Doesn't work or work wrong, fix later, maybe.
    /*public static createOrthographicCameraResizer = (renderer: THREE.WebGLRenderer, camera: THREE.OrthographicCamera) => {

        return (_e: UIEvent) => {

            const aspect = (innerWidth / innerHeight);

            camera.left   = aspect / -2;
            camera.right  = aspect /  2;
            camera.top    = aspect / -2;
            camera.bottom = aspect /  2;

            camera.updateProjectionMatrix();

            renderer.setSize(innerWidth, innerHeight);

        };

    }*/

    public constructor(canvas?: HTMLCanvasElement) {

        super(canvas, { 
            powerPreference: "low-power",
            antialias: true,
            stencil: false,
            depth: true,
        });

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.shadowMap.autoUpdate = true;

        this.renderer.outputEncoding = THREE.sRGBEncoding;

        this.renderer.toneMappingExposure = 0.3;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

    }

    public onInitialization = () => {

        this.sceneManager.push(new MainScene({
            renderer:     this.renderer,
            sceneManager: this.sceneManager,
            isOverlay:    false,
        }));

        // this.sceneManager.push<MainScene>({
            // renderer:     this.renderer,
            // sceneManager: this.sceneManager,
        // });

        // this.sceneManager.push<MainMenuScene>({
            // renderer:     this.renderer,
            // sceneManager: this.sceneManager,
        // });
      
    };

}
