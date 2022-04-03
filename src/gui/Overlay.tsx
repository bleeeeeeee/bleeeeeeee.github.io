import React from "react";

import { CenteredOverlay } from "./CenteredOverlay";

import "./Overlay.css";

const LSKEY_BUTTON_COUNT = "overlay.buttonCount";

interface OverlayProps {

    text: string;

}

interface OverlayStates {

    count: number;

}

export class Overlay extends React.Component<
    OverlayProps,
    OverlayStates
> {

    public constructor(props: OverlayProps) {

        super(props);
        this.state = {
            count: JSON.parse(localStorage.getItem(LSKEY_BUTTON_COUNT) ?? "0"),
        };

    }

    private onButtonClick = () => {

        this.setState({
            count: this.state.count + 1,
        });

        // +1 +1 +1 ++1! +!!1
        // No pok*rwi mnie z tym zaraz, dlaczego to normalnie nie dziala?
        // Dlaczego jak pare linijek temu to aktualizuje, a to dalej nie dziala.
        localStorage.setItem(LSKEY_BUTTON_COUNT, JSON.stringify(this.state.count + 1));

    };

    public render = (): React.ReactNode => (
        <CenteredOverlay>
            <div className="inner-overlay">

                <p className={"white-text pretty-text"}>
                    Count: {this.state.count}
                </p>

                <button
                    className={"click-button overlay-active-item"}
                    onClick={() => this.onButtonClick() }
                >Click Me!</button>

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
