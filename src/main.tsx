import React from "react";
import ReactDOM from "react-dom";

import { Scene } from "./engine/Scene";
import { Overlay } from "./gui/Overlay";

/*const container = document.getElementById("root")!;``

const root = ReactDOM.createRoot(container);

root.render(
    <React.StrictMode>
        <Overlay text={"Hello, World!"} />
        <Scene />
    </React.StrictMode>,
);*/

ReactDOM.render(
    <React.StrictMode>
        <Overlay text={"Hello, World!"} />
        <Scene />
    </React.StrictMode>,
    document.getElementById("root"),
);
