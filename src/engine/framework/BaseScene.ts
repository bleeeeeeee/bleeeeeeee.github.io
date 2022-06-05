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

export type DestructionMethod    = () => void;

export type UpdateMethod = (parameters: UpdateParameters) => void;
export type RenderMethod = (parameters: RenderParameters) => void;

export interface BaseSceneParameters {

    renderer: THREE.WebGLRenderer;
    sceneManager: SceneManager;

    isOverlay?: boolean;

}

export class BaseScene extends THREE.Scene {

    protected readonly sceneParameters: BaseSceneParameters;

    protected readonly renderer: THREE.WebGLRenderer;
    protected readonly sceneManager: SceneManager;

    public readonly isOverlay: boolean;

    public constructor(parameters: BaseSceneParameters) {

        super();

        this.sceneParameters = parameters;

        this.renderer     = this.sceneParameters.renderer;
        this.sceneManager = this.sceneParameters.sceneManager;

        this.isOverlay = parameters.isOverlay ?? false;

    }

    public removeAll = () => this.remove(this, ...this.children);

    public onDestruction: DestructionMethod = () => { };

    public onUpdate: UpdateMethod = () => { };
    public onRender: RenderMethod = () => { };

}
