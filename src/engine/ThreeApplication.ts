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

        super(canvas, { antialias: true, });

        this.sceneManager.set("main-scene", new MainScene({
            renderer:     this.renderer,
            sceneManager: this.sceneManager,
        }));

        this.sceneManager.set("main-menu-scene", new MainMenuScene({
            renderer:     this.renderer,
            sceneManager: this.sceneManager,
        }));

    }

    public onInitialization = () => {

        // this.sceneManager.setCurrent("main-scene");
        this.sceneManager.setCurrent("main-menu-scene");

    };

}
