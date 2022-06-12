import { ThreeApplication } from "./engine/ThreeApplication";
import { getGPUTier } from "detect-gpu";

const main = () => {

    const canvas = document.getElementById("canvas-three") as HTMLCanvasElement;

    if (canvas === null) {

        console.error("Failed to fetch canvas element!");
        return;

    }

    (async () => {
        const gpuTier = await getGPUTier();

        if (gpuTier.tier <= 1) {

            console.error("Your GPU is not supported! Buy better computer!");

        } else {

            const application = new ThreeApplication(canvas);
    
            application.onInitialization();
            application.run();

            console.log("tier ", gpuTier.tier, " isMobile ", gpuTier.isMobile, " testType ", gpuTier.type, " framerate ", gpuTier.fps, " name ", gpuTier.gpu);

        }

    })();    
};

main();
