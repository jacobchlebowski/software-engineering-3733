/**Redraw entire canvas from model. */
export function redrawCanvas(model, canvasObj, appObj){

    //here for testing purposes...
    if(typeof canvasObj === "undefined") {return;}

    const ctx = canvasObj.getContext('2d');

    if(ctx === null) {return;}



    //clear the canvas area before rendering the coordinates held in state
    ctx.clearRect(0,0,canvasObj.width,canvasObj.height);

    let nr = model.configuration.numRows;
    let nc = model.configuration.numColumns;

    ctx.fillStyle = 'white';
    ctx.fillRect(0,0,100*nc,100*nr);

}


