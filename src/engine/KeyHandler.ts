export class KeyHandler {

    // private readonly keyDownListeners: { [key: string]: (event: KeyboardEvent) => void } = {};
    private readonly keys: { [key: string]: boolean };

    private onKeyDown = (event: KeyboardEvent) => {
    
        this.keys[event.key] = true;

    };

    private onKeyUp = (event: KeyboardEvent) => {

        this.keys[event.key] = false;

    };

    public constructor() {

        this.keys = {};

        document.addEventListener("keydown", this.onKeyDown);
        document.addEventListener("keyup", this.onKeyUp);

    }

    public isPressed = (key: string): boolean => {

        return this.keys[key];

    };

}
