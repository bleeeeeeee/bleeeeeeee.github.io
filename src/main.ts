import { ThreeApplication } from "./engine/ThreeApplication";

const main = () => {

    const canvas = document.getElementById("canvas-three") as HTMLCanvasElement;

    if (canvas === null) {

        console.error("Failed to fetch canvas element!");
        return;

    }

    const application = new ThreeApplication(canvas);
    
    application.onInitialization();
    application.run();

};

main();
