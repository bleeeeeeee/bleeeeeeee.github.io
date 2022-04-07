import * as THREE from "three";
import { BaseScene } from "./BaseScene";

import { SceneManager } from "./SceneManager";

interface IBaseApplication {

    initialize: () => Promise<void>;

}

export class BaseApplication implements IBaseApplication {

    protected readonly renderer: THREE.WebGLRenderer;
    protected readonly sceneManager: SceneManager;

    private lastFrameScene?: BaseScene = undefined;

    private deltaTime = 0;
    private sceneTime = 0;
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

        this.sceneTime = this.lastFrameScene == this.sceneManager.getCurrent()
            ? this.sceneTime += this.deltaTime : 0;

        this.lastFrameScene = this.sceneManager.getCurrent();

        this.sceneManager.getCurrent()?.onUpdate({
            deltaTime: this.deltaTime,
            sceneTime: 0,
            totalTime: time,
        });

        this.sceneManager.getCurrent()?.onRender({
            //renderer: this.renderer,
        });

    };

    public run = () => this.renderer.setAnimationLoop(this.gameLoop);

}
