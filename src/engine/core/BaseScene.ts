/**
 * I also really dislike this implementation.
 * Think of something a little bit better, please.
 */

 import * as THREE from "three";
 import { SceneManager } from "./SceneManager";
 
 export interface UpdateParameters {
 
     deltaTime: number;
     totalTime: number;
 
 }
 
 export interface RenderParameters {}
 export interface InitializeParameters {}
 
 export type InitializeMethod = (paramters: InitializeParameters) => Promise<void>;
 
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
 
     public constructor(parameters: BaseSceneParameters) {
 
         super();
 
         this.sceneParameters = parameters;
 
         this.renderer     = this.sceneParameters.renderer;
         this.sceneManager = this.sceneParameters.sceneManager;
 
     }
 
     public removeAll = () => this.remove(this, ...this.children);
 
     public initialize: InitializeMethod = async () => {};
 
     public udpate: UpdateMethod = () => {};
     public render: RenderMethod = () => {};
 
 }
 