///////////////IMPORTS///////////////
// import logo from './logo.svg';
import React from 'react';
import './App.css';
import { layout } from './Layout';
import Model from './model/Model.js';
import { redrawCanvas } from './boundary/Boundary';
/////////////////////////////////////


//Model
import { level1 } from './model/Configuration.js'
var actualConfiguration = JSON.parse(JSON.stringify(level1));


//Application
function App() {
  //initial instantiation of the Model
  const [model,setModel] = React.useState(new Model(actualConfiguration));

  const appRef = React.useRef(null);    //Later need to be able to refer to App
  const canvasRef = React.useRef(null); //Later need to be able to refer to Canvas

  /** Ensures initial rendering is performed, and that whenever model changes, it is re-rendered. */
  React.useEffect (() => {
    
   
    /** Happens once. */
    redrawCanvas(model, canvasRef.current, appRef.current);
  }, [model])   // this second argument is CRITICAL, since it declares when to refresh (whenever Model changes)


  return (
      <main style={layout.Appmain} ref={appRef}>
        <canvas tabIndex="1"
        className="App-canvas"
        ref={canvasRef}
        width={layout.canvas.width}
        height={layout.canvas.height}
        />
        <label style={layout.text}> {"number moves: " + model.numMoves}</label>
        <div style={layout.buttons}>
            <button style={layout.upbutton}>^</button>
            <button style={layout.leftbutton}>&lt;</button>
            <button style={layout.rightbutton}>&gt;</button>
            <button style={layout.downbutton}>v;</button>
        </div>
      </main>
  );
}

export default App;
