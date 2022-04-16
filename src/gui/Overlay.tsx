import React, { useEffect, useState } from "react";

import { CenteredOverlay } from "./CenteredOverlay";

import { stringHash } from "../utility/StringHash";
import { setLocalStorage, getLocalStorage } from "../utility/LocalStorage";

import "./Overlay.css";

/**
 * Local storage keys
 */
const LS_KEYS = {

    "overlay.buttonCount":  stringHash("overlay.buttonCount"),
    "overlay.refreshCount": stringHash("overlay.refreshCount"),

};

interface OverlayProps {}

interface OverlayStates {

    count: number;

}

export class Overlay extends React.Component<
    OverlayProps,
    OverlayStates
> {

    private readonly refreshCount: number;

    public constructor(props: OverlayProps) {

        super(props);
        this.state = {
            count: getLocalStorage(LS_KEYS["overlay.buttonCount"], 0),
        };

        this.refreshCount = getLocalStorage(LS_KEYS["overlay.refreshCount"], 0);

    }

    public componentDidMount = () => {

        setLocalStorage(LS_KEYS["overlay.refreshCount"], this.refreshCount + 1);

    };

    public componentDidUpdate = () => {

        setLocalStorage(LS_KEYS["overlay.buttonCount"], this.state.count);

    };

    private onButtonClick = () => {

        this.setState((state) => ({
            count: state.count + 1,
        }));

    };

    public render = (): React.ReactNode => (
        <CenteredOverlay>
            <div className="inner-overlay">

                <p className={"white-text pretty-text large-text"}>
                    Count: {this.state.count}
                </p>

                <button
                    className={"click-button overlay-active-item"}
                    onClick={() => this.onButtonClick() }
                >Click Me!</button>

                <p className={"white-text pretty-text corner-text"}>
                    Refresh count: {this.refreshCount}
                </p>

            </div>
        </CenteredOverlay>
    );

}
