import React from "react";

export const ThreeApplication = () => {

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

};
