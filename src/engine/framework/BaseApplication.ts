import * as THREE from "three";

import { BaseScene } from "./BaseScene";
import { SceneManager } from "./SceneManager";

import { KeyHandler } from "./KeyHandler";

export class BaseApplication {

    protected readonly renderer: THREE.WebGLRenderer;
    protected readonly sceneManager: SceneManager;

    private lastFrameScene?: BaseScene = undefined;

    private deltaTime = 0;
    private sceneTime = 0;
    private lastTime  = 0;

    private isRunning: boolean;

    public constructor(
        canvas?: HTMLCanvasElement,
        renderParameters: THREE.WebGLRendererParameters = {}
    ) {

        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            ...renderParameters,
        });
        this.renderer.setSize(innerWidth, innerHeight);

        this.sceneManager = new SceneManager();

        this.isRunning = false;

        KeyHandler.initialize();

    }

    public running = () => this.isRunning;

    public onInitialization = () => {};
    public onDestruction    = () => {};

    public gameLoop: THREE.XRAnimationLoopCallback = (time: number, _frame?: THREE.XRFrame) => {

        if (this.sceneManager.getCurrent() === undefined) {

            this.isRunning = false;
            this.renderer.setAnimationLoop(null);
            this.renderer.clear();

        }

        this.deltaTime = (time - this.lastTime) / 1000;
        this.lastTime = time;

        this.sceneTime = this.lastFrameScene == this.sceneManager.getCurrent()
            ? this.sceneTime += this.deltaTime : 0;

        this.lastFrameScene = this.sceneManager.getCurrent();

        this.sceneManager.getCurrent()?.onUpdate({
            deltaTime: this.deltaTime,
            sceneTime: this.sceneTime,
            totalTime: time,
        });

        this.sceneManager.getCurrent()?.onRender({
            //renderer: this.renderer,
        });

    };

    public run = () => {

        this.isRunning = true;
        this.renderer.setAnimationLoop(this.gameLoop);

    } ;

}
