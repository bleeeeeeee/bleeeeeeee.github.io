/**
 * Value keys for key data in KeyboardEvent.
 */
export enum Keys {

}

/**
 * Value keys for button data in MouseEvent.
 */
export enum Buttons {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

export class KeyHandler {

    private static readonly keys: { [key: string]: boolean } = {};
    private static readonly buttons: { [button: number]: boolean } = {};

    private static initialized = false;

    private static onKeyDown    = (event: KeyboardEvent) => KeyHandler.keys[event.key]       = true;
    private static onKeyUp      = (event: KeyboardEvent) => KeyHandler.keys[event.key]       = false;
    private static onButtonDown = (event: MouseEvent)    => KeyHandler.buttons[event.button] = true;
    private static onButtonUp   = (event: MouseEvent)    => KeyHandler.buttons[event.button] = false;

    private constructor() {}

    public static initialize = () => {

        if (KeyHandler.initialized) return;

        this.initialized = true;

        document.addEventListener("keydown", KeyHandler.onKeyDown);
        document.addEventListener("keyup", KeyHandler.onKeyUp);
        document.addEventListener("mousedown", KeyHandler.onButtonDown);
        document.addEventListener("mouseup", KeyHandler.onButtonUp);

    };

    public static isKeyPressed    = (key: string): boolean    => KeyHandler.keys[key];
    public static isButtonPressed = (button: number): boolean => KeyHandler.buttons[button];

}
