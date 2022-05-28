export class KeyHandler {

    // private readonly keyDownListeners: { [key: string]: (event: KeyboardEvent) => void } = {};
    private readonly keys: { [key: string]: boolean };
    private readonly buttons: { [button: string]: boolean };


    private onKeyDown = (event: KeyboardEvent) => {
    
        this.keys[event.key] = true;

    };

    private onKeyUp = (event: KeyboardEvent) => {

        this.keys[event.key] = false;

    };

    private onMouseDown = (event: MouseEvent) => {

        this.buttons[event.button] = true;

    };

    private onMouseUp = (event: MouseEvent) => {

        this.buttons[event.button] = false;

    };

    public constructor() {

        this.keys = {};
        this.buttons = {};

        document.addEventListener("keydown", this.onKeyDown);
        document.addEventListener("keyup", this.onKeyUp);

        document.addEventListener("mousedown", this.onMouseDown);
        document.addEventListener("mouseup", this.onMouseUp);

    }

    public isKeyPressed = (key: string): boolean => {

        return this.keys[key];

    };

    public isButtonPressed = (button: string): boolean => {

        return this.buttons[button];

    };

}
