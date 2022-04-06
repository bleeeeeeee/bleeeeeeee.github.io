import React from "react";

interface ThreeApplicationProps {

}

export class ThreeApplication extends React.Component<ThreeApplicationProps> {

    private readonly canvasRef: React.RefObject<HTMLCanvasElement>;

    public constructor(props: ThreeApplicationProps) {

        super(props);

        this.canvasRef = React.createRef();

    }

    public render = () => (
        <canvas ref={this.canvasRef}></canvas>
    );

}
