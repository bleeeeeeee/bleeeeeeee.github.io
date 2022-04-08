import React from "react";

import { ThreeEntryPoint } from "./engine/ThreeEntryPoint";

import { Overlay } from "./gui/Overlay";

export const RootApplication = () => {

    return (
        <React.StrictMode>
            <Overlay />
            <ThreeEntryPoint />
            {/* <Scene /> */}
        </React.StrictMode>
    );

};
