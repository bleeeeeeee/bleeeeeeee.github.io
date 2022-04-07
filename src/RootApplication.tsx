import React from "react";

import { ThreeApplication } from "./engine/ThreeApplication";
import { Overlay } from "./gui/Overlay";

export const RootApplication = () => {

    return (
        <React.StrictMode>
            <Overlay />
            <ThreeApplication />
            {/* <Scene /> */}
        </React.StrictMode>
    );

};
