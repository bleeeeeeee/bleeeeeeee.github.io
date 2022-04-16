import React, { useEffect } from "react";

import { ThreeApplication } from "./ThreeApplication";

/*export const ThreeApplication = () => {

    const canvasRef = React.createRef<HTMLCanvasElement>();

    React.useEffect(() => {

        const threeApplication = new ViewGL(canvasRef.current ?? undefined);
        threeApplication.onInitialization();

        return () => {

            threeApplication.onDestruction();

        };

    }, []);

    return (
        <canvas className="canvas-three" ref={canvasRef} />
    );

};*/

export const ThreeEntryPoint = () => {

    const canvasRef = React.createRef<HTMLCanvasElement>();

    useEffect(() => {

        const threeApplication = new ThreeApplication(canvasRef.current ?? undefined);
        threeApplication.onInitialization();

        threeApplication.run();

        return () => {

            threeApplication.onDestruction();

        };

    }, []);

    return (
        <div>
            <canvas className="canvas-three" ref={canvasRef} />
        </div>
    );

};
