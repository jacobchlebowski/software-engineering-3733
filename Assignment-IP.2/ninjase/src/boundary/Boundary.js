//Scaling Constants for Canvas
var BOXSIZE = 100;
const OFFSET = 8;

/**Represents a rectangle. */
export class Rectangle{
    constructor(x,y,width,height){
        this.x=x;
        this.y=y;
        this.width = width;
        this.height = height;
    }
}


/**Map wall/keys/doors into rectangle in configuration view */
export function computeRectangle(wall){
    let c = wall.location();
    const test = new Rectangle(BOXSIZE*wall.column + OFFSET, BOXSIZE*wall.row + OFFSET, 
        BOXSIZE - 2*OFFSET, BOXSIZE - 2*OFFSET);

    
    console.log(test)

    return new Rectangle(BOXSIZE*c.column + OFFSET, BOXSIZE*c.row + OFFSET, 
        BOXSIZE - 2*OFFSET, BOXSIZE - 2*OFFSET);
} 





/**Draw configuration. */
export function drawConfiguration(ctx,configuration){
    ctx.shadowColor = 'black';

    configuration.walls.forEach(wall => {
        let rect = computeRectangle(wall);
        ctx.fillStyle = 'lightblue';

        //ctx.shadowBlur=10;
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    })
    
    // configuration.keys.forEach(key=>{
    //     let rect = computeRectangle(key);
    //     ctx.fillStyle = 'lightblue';
    // })

    // configuration.doors.forEach(door=>{
    //     let rect = computeRectangle(door);
    //     ctx.fillStyle = 'lightblue';
    // })
    
}


/**Redraw entire canvas from model. */
export function redrawCanvas(model, canvasObj, appObj){


    const ctx = canvasObj.getContext('2d');
    if(ctx === null) {return;} //here for testing purposes...



    //clear the canvas area before rendering the coordinates held in state
    ctx.clearRect(0,0,canvasObj.width,canvasObj.height);

    // let nr = model.configuration.numRows;
    // let nc = model.configuration.numColumns;

    // ctx.fillStyle = 'white';
    // ctx.fillRect(10,100,200*nc,200*nr);


    if(model.configuration){
        drawConfiguration(ctx,model.configuration)
    }
}


