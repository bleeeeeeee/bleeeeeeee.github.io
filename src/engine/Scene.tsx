import React, { useEffect } from "react";

import { ViewGL } from "./ViewGL";

export const _Scene = () => {

    const canvasRef = React.createRef<HTMLCanvasElement>();

    React.useEffect(() => {

        const threeApplication = new ViewGL(canvasRef.current ?? undefined);
        threeApplication.onInitialization();

        return () => {

            threeApplication.onDestruction();

        };

    }, []);

    return (
        <div className="canvas-container">
            <canvas className="canvas-three" ref={canvasRef}/>
        </div>
    );

};

export class Scene extends React.Component {

    private readonly canvasRef = React.createRef<HTMLCanvasElement>();

    private viewGL: ViewGL;

    public componentDidMount = () => {

        const canvas = this.canvasRef.current;
        this.viewGL = new ViewGL(canvas ?? undefined);

        this.viewGL.onInitialization();

    };

    // Maybe make something with that
    public componentDidUpdate = () => {};

    public componentWillUnmount = () => {

        this.viewGL.onDestruction();

    };
    
    public render = (): JSX.Element => (
        <div className="canvas-container">
            <canvas className="canvas-three" ref={this.canvasRef}/>
        </div>
    );

}
