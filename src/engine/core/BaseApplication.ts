import * as THREE from "three";
import { SceneManager } from "./SceneManager";

interface IBaseApplication {

    initialize: () => Promise<void>;

}

export class BaseApplication implements IBaseApplication {

    protected readonly renderer: THREE.WebGLRenderer;
    protected readonly sceneManager: SceneManager;

    private deltaTime = 0;
    private lastTime  = 0;

    public constructor(
        canvas: HTMLCanvasElement | undefined,
        renderParameters: THREE.WebGLRendererParameters = {}
    ) {

        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            ...renderParameters,
        });
        this.renderer.setSize(innerWidth, innerHeight);

        this.sceneManager = new SceneManager();

    }

    public initialize = async () => {};

    public gameLoop: THREE.XRAnimationLoopCallback = (time: number, _frame?: THREE.XRFrame) => {

        this.deltaTime = (time - this.lastTime) / 1000;
        this.lastTime = time;

        this.sceneManager.getCurrent()?.udpate({
            deltaTime: this.deltaTime,
            totalTime: time,
        });

        this.sceneManager.getCurrent()?.render({
            //renderer: this.renderer,
        });

    };

    public run = () => this.renderer.setAnimationLoop(this.gameLoop);

}
