import React from "react";
import * as ReactDOM17 from "react-dom";
import * as ReactDOM18 from "react-dom/client";

import { RootApplication } from "./RootApplication";

export const REACT_VERSION_STABLE = 17;
export const REACT_VERSION_NEWEST = 18;

export const CURRENT_REACT_VERSION = REACT_VERSION_STABLE;

type ReactContainer = Element | DocumentFragment;

const getReactRoot = () => {

    return (
        <React.StrictMode>
            <RootApplication />
        </React.StrictMode>
    );

};

/**
 * Renders react's v17 elements to the document.
 * @error Warning: ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17.
 * @info Learn more: https://reactjs.org/link/switch-to-createroot.
 * 
 * @param container root container
 */
const renderReact17 = (container: ReactContainer) => {

    ReactDOM17.render(getReactRoot(), container);

};

/**
 * Renders react's v18 elements to the document.
 * 
 * @warning_x32 WebGL warning: uniform setter: UniformLocation is not from the current active Program.
 * @warning_x1 After reporting 32, no further warnings will be reported for this WebGL context.
 * 
 * @param container root container
 */
const renderReact18 = (container: ReactContainer) => {

    const root = ReactDOM18.createRoot(container);
    root.render(getReactRoot());

};

const renderReact = (container: ReactContainer, version: number) => {

    switch (version) {

        case REACT_VERSION_STABLE: renderReact17(container); break;
        case REACT_VERSION_NEWEST: renderReact18(container); break;

        default: {
            console.error("Selected unsupported react version!");
            return;
        }

    }

};

const main = () => {
    
    const container = document.getElementById("root");
    if (container === null) {

        console.error("Root container cannot be found!");
        return;

    }

    renderReact(container, CURRENT_REACT_VERSION);

};

main();
