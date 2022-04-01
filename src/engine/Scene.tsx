import React from "react";

import { ViewGL } from "./ViewGL";

export class Scene extends React.Component {

    private readonly canvasRef = React.createRef<HTMLCanvasElement>();

    private viewGL: ViewGL;

    /*constructor(props: any) {

        super(props);

        this.canvasRef = React.createRef();

        // tsconfig.json:["strictPropertyInitialization": true]
        // this.viewGL = new ViewGL(this.canvasRef.current);

    }*/

    public componentDidMount = () => {

        const canvas = this.canvasRef.current;
        this.viewGL = new ViewGL(canvas ?? undefined);

        this.viewGL.onInitialization();

    };

    // Maybe make something with that
    public componentDidUpdate = () => {};

    public componentWillUnmount = () => {

        this.viewGL.onDestruction();

    };
    
    public render = (): JSX.Element => (
        <div className="canvas-container">
            <canvas className="canvas-three" ref={this.canvasRef}/>
        </div>
    );

}

/*function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  )

    

}*/
