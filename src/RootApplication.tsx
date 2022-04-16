import React from "react";

import { Overlay } from "./gui/Overlay";

import { ThreeEntryPoint } from "./engine/ThreeEntryPoint";

export const RootApplication = () => {

    return (
        <React.StrictMode>
            <Overlay />
            <ThreeEntryPoint />
        </React.StrictMode>
    );

};
