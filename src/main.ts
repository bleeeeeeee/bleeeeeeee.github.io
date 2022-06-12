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
      
        // Example output:
        // {
        //   "tier": 1,
        //   "isMobile": false,
        //   "type": "BENCHMARK",
        //   "fps": 21,
        //   "gpu": "intel iris graphics 6100"
        // }

        if (gpuTier.tier <= 2) {

            console.error("Your GPU is not supported! Buy better computer!");

        } else {

            console.log(gpuTier.tier, gpuTier.isMobile, gpuTier.type, gpuTier.fps, gpuTier.gpu);
            const application = new ThreeApplication(canvas);
    
            application.onInitialization();
            application.run();

        }

    })();    
};

main();
