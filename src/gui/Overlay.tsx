import React from "react";

import { CenteredOverlay } from "./CenteredOverlay";
import { stringHash } from "../utility/StringHash";

import "./Overlay.css";

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
            count: JSON.parse(localStorage.getItem(LS_KEYS["overlay.buttonCount"]) ?? "0"),
        };

        this.refreshCount = JSON.parse(localStorage.getItem(LS_KEYS["overlay.refreshCount"]) ?? "0");

    }

    public componentDidMount = () => {

        localStorage.setItem(
            LS_KEYS["overlay.refreshCount"],
            JSON.stringify(this.refreshCount + 1)
        );

    };

    public componentDidUpdate = () => {

        localStorage.setItem(
            LS_KEYS["overlay.buttonCount"],
            JSON.stringify(this.state.count)
        );

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

/*export const Overlay = (): React.ReactNode => {

    const [count, setCount] = React.useState<number>(0);

    React.useEffect(() => {

        setCount(JSON.parse(localStorage.getItem(LSKEY_BUTTON_COUNT) ?? "0"));

    }, []);

    React.useEffect(() => {

        localStorage.setItem(LSKEY_BUTTON_COUNT, JSON.stringify(count));

    }, [count]);

    return (
        <CenteredOverlay>
            <div className="inner-overlay">

                <p className={"white-text pretty-text"}>
                    Count: {count}
                </p>

                <button
                    className={"click-button overlay-active-item"}
                    onClick={() => setCount((count) => count + 1) }
                >Click Me!</button>

            </div>
        </CenteredOverlay>
    );

};*/
