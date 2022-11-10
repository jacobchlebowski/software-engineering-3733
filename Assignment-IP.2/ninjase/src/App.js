///////////////IMPORTS///////////////
// import logo from './logo.svg';
import React from 'react';
import './App.css';
import { layout } from './Layout';
import Model from './model/Model.js';
import { redrawCanvas } from './boundary/Boundary.js';
import { moveNinjase } from './controller/Controller.js';
import { pickUpKey } from './controller/Controller.js';
import { Up, Down, Left, Right } from './model/Model.js';
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



  const moveNinjaseHandler = (direction) => {
    let newModel = moveNinjase(model,direction);
    setModel(newModel); //react to changes, if model has changed.
  }

  const pickUpKeyHandler = (model) => {
    let newModel = pickUpKey(model);
    setModel(newModel); //react to changes
  }



  return (
      <main style={layout.Appmain} ref={appRef}>
        <div style={layout.configurationbuttons}>
        <button style={layout.levelbuttonsone}>Level 1</button>
        <button style={layout.levelbuttonstwo}>Level 2</button>
        <button style={layout.levelbuttonsthree}>Level 3</button>
        </div>
        <button style={layout.resetbutton}>Reset!</button>
        <canvas tabIndex="1"
        className="App-canvas"
        ref={canvasRef}
        width={layout.canvas.width}
        height={layout.canvas.height}
        />
        <br></br><label style={layout.signature}>Jacob Chlebowski</label><br></br>
        <label style={layout.signature}>jachlebowski@wpi.edu</label>
        <label style={layout.text}> {"number of moves: " + model.numMoves}</label>
        <label style={layout.currentKeyText}> {"current key: " + JSON.stringify(model.configuration.ninjase[0].currentColor())}</label>
        <div style={layout.buttons}>
            <button style={layout.upbutton} onClick={(e)=> moveNinjaseHandler(Up)} disabled={!model.available(Up)}>^</button>
            <button style={layout.leftbutton} onClick={(e)=> moveNinjaseHandler(Left)} disabled={!model.available(Left)}>&lt;</button>
            <button style={layout.rightbutton} onClick={(e)=> moveNinjaseHandler(Right)} disabled={!model.available(Right)}>&gt;</button>
            <button style={layout.downbutton} onClick={(e)=> moveNinjaseHandler(Down)} disabled={!model.available(Down)}>v</button>
            <button style={layout.pickupkeybutton} onClick={(e)=> pickUpKeyHandler(model)}>Pick-Up Key!</button>
        </div>
      </main>
  );
}

export default App;
