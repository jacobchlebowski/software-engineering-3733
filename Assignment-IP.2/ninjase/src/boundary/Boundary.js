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

    /** Does the (x,y) point exist within the rectangle */
    contains(x,y){
        return x>this.x&& x <= (this.x + this.width) && y >= this.y && y <= (this.y + this.height);
    }
}


/**Map walls into rectangle in configuration view */
export function computeWallRectangle(wall){
    let c = wall.location();
    return new Rectangle(BOXSIZE*c.column + OFFSET, BOXSIZE*c.row + OFFSET, 
        BOXSIZE - 2*OFFSET, BOXSIZE - 2*OFFSET);
} 


/**Map keys into rectangle in configuration view */
export function computeKeyRectangle(key){
    let c = key.location();
    return new Rectangle(20+BOXSIZE*c.column + OFFSET, 25+BOXSIZE*c.row + OFFSET, 
        BOXSIZE - 8*OFFSET, BOXSIZE - 8*OFFSET);
} 


/**Map doors into rectangle in configuration view */
export function computeDoorRectangle(door){
    let c = door.location();
    return new Rectangle(BOXSIZE*c.column + OFFSET, BOXSIZE*c.row + OFFSET, 
        BOXSIZE - 2*OFFSET, BOXSIZE - 2*OFFSET);
} 


/**Map ninjase into rectangle in configuration view */
export function computeNinjaseRectangle(ninjase){
    let c = ninjase.location();
    return new Rectangle(BOXSIZE*c.column + OFFSET, BOXSIZE*c.row + OFFSET, 
        BOXSIZE - 2*OFFSET, BOXSIZE - 2*OFFSET);
} 





/**Draw configuration. */
export function drawConfiguration(ctx,configuration){
    ctx.shadowColor = 'black';

    configuration.walls.forEach(wall => {
        let rect = computeWallRectangle(wall);
        ctx.fillStyle = 'lightblue';
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    })
    
    configuration.keys.forEach(key=>{
        let rect = computeKeyRectangle(key);
        ctx.fillStyle = key.color;
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    })

    configuration.doors.forEach(door=>{
        let rect = computeDoorRectangle(door);
        ctx.fillStyle = door.color;
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    })


    configuration.ninjase.forEach(ninjase=>{
        let rect = computeNinjaseRectangle(ninjase);
        ctx.fillStyle = '#a349a4';
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    })
    
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


