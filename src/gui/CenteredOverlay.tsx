import React, { ReactNode } from "react";

import "./CenteredOverlay.css";

interface CenteredOverlayProps {

    children: React.ReactNode;

}

export class CenteredOverlay extends React.Component<CenteredOverlayProps> {

    public render = (): ReactNode => (
        <div className="centered-overlay">{this.props.children}</div>
    );

}
