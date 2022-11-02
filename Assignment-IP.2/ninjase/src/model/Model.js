// export class MoveType{
//     constructor (dr,dc) {
//         this.deltar = dr;
//         this.deltac = dc;
//     }
// }

// //Not needed?
// export class Coordinate {
//     constructor(row,column){
//         this.row = row;
//         this.column = column;
//     }
// }

//Key and door have corresponding colors
export class Key{
    constructor(row,column,color){
       this.row = row;
       this.column = column;
       this.color = color;
    }
}


export class Door{
    constructor(row,column,color){
       this.row = row;
       this.column = column;
       this.color = color;
    }
}


export class Wall{
    constructor(row,column){
        this.row = row;
        this.column = column;
    }
}

//placed on board, starts off without key until picked up
export class Ninjase {
    constructor(row,column){
        this.row = row
        this.column = column
        currentKey = null;
    }
}



//THIS IS THE PUZZLE
export class Configuration {
  constructor(numRows,numColumns, ninjase, walls, doors, keys){
        this.numRows = numRows;
        this.numColumns = numColumns;
        this.ninjase = ninjase;
        this.walls = walls
        this.doors = doors
        this.keys = keys
  }
}


export default class Model {
    //info is going to be JSON-encoded configuration
    constructor(info) {
        this.initialize(info);
    }
    initialize(info){
        //make puzzle
        let numRows = parseInt(info.rows)
        let numColumns = parseInt(info.columns)
        let ninjase =  parseInt(info.ninjase)
        let walls = []
        let doors = []
        let keys  = []

        //initialize
        this.configuration = new Configuration(numRows,numColumns,ninjase, walls, doors, keys)
        this.numMoves = 0;
        this.victory = false;
    }
}