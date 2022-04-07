import { BaseScene } from "./BaseScene";

/**
 * Just ugly. Refactor so I won't vomit next time.
 */
export class SceneManager {

    private readonly scenes: Map<string, BaseScene>;
    private current?: BaseScene;

    public constructor() {

        this.scenes = new Map();
        this.current = undefined;

    }

    public has = (key: string) => this.scenes.has(key);
    public get = (key: string) => this.scenes.get(key);
    public set = (key: string, value: BaseScene) => this.scenes.set(key, value);
    public delete = (key: string) => this.scenes.delete(key);

    public size = () => this.scenes.size;

    public getCurrent = () => this.current;

    public setCurrent = (key: string): boolean => {

        const currentScene = this.current;

        if (!this.scenes.has(key)) {

            return false;

        }

        currentScene?.removeAll();

        this.current = this.scenes.get(key);
        this.current?.onInitialization({});

        if (this.current === undefined) {

            console.error("Something's wrong ups!");

        }

        return true;

    };

}
