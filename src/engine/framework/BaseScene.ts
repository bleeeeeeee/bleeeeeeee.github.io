/**
 * I also really dislike this implementation.
 * Think of something a little bit better, please.
 */

import * as THREE from "three";
import { SceneManager } from "./SceneManager";

export interface UpdateParameters {

    deltaTime: number;
    sceneTime: number;
    totalTime: number;

}

export interface RenderParameters { }

export interface InitializeParameters {

    /**
     * A key which is being assigned by the SceneManager.
     */
    key: string;

}

export type InitializationMethod = (parameters: InitializeParameters) => void;
export type DestructionMethod    = () => void;

export type UpdateMethod = (parameters: UpdateParameters) => void;
export type RenderMethod = (parameters: RenderParameters) => void;

export interface BaseSceneParameters {

    renderer: THREE.WebGLRenderer;
    sceneManager: SceneManager;

}

export class BaseScene extends THREE.Scene {

    protected readonly sceneParameters: BaseSceneParameters;

    protected readonly renderer: THREE.WebGLRenderer;
    protected readonly sceneManager: SceneManager;

    protected managerKey = "no-key";

    public constructor(parameters: BaseSceneParameters) {

        super();

        this.sceneParameters = parameters;

        this.renderer     = this.sceneParameters.renderer;
        this.sceneManager = this.sceneParameters.sceneManager;

    }

    public removeAll = () => this.remove(this, ...this.children);

    public onInitialization: InitializationMethod = async () => { };
    public onDestruction:    DestructionMethod    = async () => { };

    public onUpdate: UpdateMethod = () => { };
    public onRender: RenderMethod = () => { };

}
