// import { BaseScene } from "./BaseScene";

// /**
//  * Just ugly. Refactor so I won't vomit next time.
//  */
// export class SceneManager {

//     private readonly scenes: Map<string, BaseScene>;
//     private current?: BaseScene;

//     public constructor() {

//         this.scenes = new Map();
//         this.current = undefined;

//     }

//     public has = (key: string) => this.scenes.has(key);
//     public get = (key: string) => this.scenes.get(key);
//     public set = (key: string, value: BaseScene) => this.scenes.set(key, value);

//     public delete = (key: string) => {

//         if (this.scenes.get(key) === this.current) {

//             this.current = undefined;

//         }

//         this.scenes.get(key)?.onDestruction();
//         this.scenes.delete(key);

//     };

//     public size = () => this.scenes.size;

//     public getCurrent = () => this.current;

//     public setCurrent = (key: string): boolean => {

//         const currentScene = this.current;

//         if (!this.scenes.has(key)) {

//             return false;

//         }

//         currentScene?.onDestruction();
//         currentScene?.removeAll();

//         this.current = this.scenes.get(key);
//         this.current?.onInitialization({ key });

//         if (this.current === undefined) {

//             console.error("Something's wrong ups!");

//         }

//         return true;

//     };

// }

import { BaseScene, BaseSceneParameters } from "./BaseScene";

export class SceneManager {

    private readonly scenes: BaseScene[] = [];

    public constructor() {
    }

    // public push = <SceneType extends BaseScene>(params: BaseSceneParameters): T => {

        // const scene = new SceneType(params);

        // this.scenes.push(scene);
        
        // return scene;

    // };

    public push = <SceneType extends BaseScene>(scene: SceneType): SceneType => {

        this.scenes.push(scene);
        return scene;

    };

    public pop = (): BaseScene | undefined => {

        const scene = this.scenes.pop();

        scene?.onDestruction();
        scene?.removeAll();

        return scene;

    };

    public top = (): BaseScene | undefined => {

        return this.scenes.length
            ? this.scenes[this.scenes.length - 1]
            : undefined;

    };

    public getUpdatables = (): BaseScene[] => {

        const updatables: BaseScene[] = [];

        for (let i = this.scenes.length - 1; i >= 0; i--) {

            if (this.scenes[i].isOverlay) continue;
            updatables.push(this.scenes[i]);

        }

        return updatables;

    };

}
