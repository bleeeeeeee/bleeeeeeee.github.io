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

        if (this.canvasRef.current === null) return;

        const canvas = this.canvasRef.current;
        this.viewGL = new ViewGL(canvas);
        
        // Idk why, but without it canvas is only a small rectangle        
        this.viewGL.onWindowResize(innerWidth, innerHeight);

        window.addEventListener("mousemove", this.mouseMove);
        window.addEventListener("resize", this.handleResize);

    };

    public componentDidUpdate = () => {

    };

    public componentWillUnmount = () => {

        window.removeEventListener("mousemove", this.mouseMove);
        window.removeEventListener("resize", this.handleResize);

    };

    public mouseMove    = () => this.viewGL.onMouseMove();
    public handleResize = () => this.viewGL.onWindowResize(innerWidth, innerHeight);

    public render = (): JSX.Element => (
        <div className='canvasContainer'>
            <canvas ref={this.canvasRef}/>
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
