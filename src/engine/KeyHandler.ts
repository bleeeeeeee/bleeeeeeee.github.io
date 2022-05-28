export class KeyHandler {

    private static readonly keys: { [key: string]: boolean } = {};
    private static initialized = false;

    private static onKeyDown = (event: KeyboardEvent) => KeyHandler.keys[event.key] = true;
    private static onKeyUp   = (event: KeyboardEvent) => KeyHandler.keys[event.key] = false;

    public static initialize = () => {

        if (KeyHandler.initialized) return;

        document.addEventListener("keydown", KeyHandler.onKeyDown);
        document.addEventListener("keyup", KeyHandler.onKeyUp);

    };

    public static isPressed = (key: string): boolean => {

        return KeyHandler.keys[key];

    };

}
