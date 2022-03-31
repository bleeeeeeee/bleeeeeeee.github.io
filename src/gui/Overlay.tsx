import React from "react";

import "./Overlay.css";

export class Overlay extends React.Component<{ text: string, }> {

    public render = (): JSX.Element => (
        <div className={"overlay"}>
            <p className={"white-text pretty-text"}>{this.props.text}</p>
        </div>
    );

}
