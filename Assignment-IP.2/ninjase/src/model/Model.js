// export class MoveType{
//     constructor (dr,dc) {
//         this.deltar = dr;
//         this.deltac = dc;
//     }
// }

//Needed for keys/doors/walls??
export class Coordinate {
    constructor(row,column){
        this.row = row;
        this.column = column;
    }
}


//Key and door have corresponding colors
export class Key{
    constructor(row,column,color){
       this.row = row;
       this.column = column;
       this.color = color;
    }

    place(row,col){
        this.row=row;
        this.column=col;
    }

    location() {
        return new Coordinate(this.row,this.column);
       }


    //used for solving
    copy(){
        let k = new Key(this.row,this.column,this.color);
        k.place(this.row,this.column);
        return k;
    }
}


export class Door{
    constructor(row,column,color){
       this.row = row;
       this.column = column;
       this.color = color;
    }
    place(row,col){
        this.row=row;
        this.column=col;
    }

    location() {
        return new Coordinate(this.row,this.column);
       }

    copy(){
        let d = new Door(this.row,this.column,this.color);
        d.place(this.row,this.column);
        return d;
    }
}


export class Wall{
    constructor(row,column){
        this.row = row;
        this.column = column;
    }
    place(row,col){
        this.row=row;
        this.column=col;
    }

    location() {
        return new Coordinate(this.row,this.column);
       }


    copy(){
        let w = new Door(this.row,this.column);
        w.place(this.row,this.column);
        return w;
    }
}

//placed on board, starts off without key until picked up
export class Ninjase {
    constructor(row,column){
        this.row = row
        this.column = column
        this.currentKey = null;
    }
    place(row,col){
        this.row=row;
        this.column=col;
    }

    location() {
        return new Coordinate(this.row,this.column);
       }


    copy(){
        let w = new Ninjase(this.row,this.column);
        w.place(this.row,this.column);
        return w;
    }
}



//THIS IS THE CONFIGURATION
export class Configuration {
  constructor(numRows,numColumns, ninjase){
        this.numRows = numRows;
        this.numColumns = numColumns;
        this.ninjase = ninjase;
  }

  initialize(walls,keys,doors,ninjase){
    //make sure to create NEW walls/keys/doors objects
    this.walls = walls.map(p=>p.copy());
    this.keys  = keys.map(k=>k.copy());
    this.doors = doors.map(d => d.copy());
    this.ninjase = ninjase.map(n => n.copy());
  }

  //return all blocks?
//   *blocks() {
//     for(let i=0; i<this.walls.length; i++){
//         yield this.walls[i];
//     }
//     for(let j=0; j<this.keys.length; j++){
//         yield this.keys[j];
//     }
//     for(let k=0; k<this.doors.length; k++){
//         yield this.doors[k];
//     }
//   }

}


export default class Model {
    //info is going to be JSON-encoded configuration
    constructor(info) {
        this.initialize(info);
    }
    initialize(info){
        //make configuration
        let numRows = parseInt(info.rows)
        let numColumns = parseInt(info.columns)
        let ninjase =  info.ninjase

        var allWalls = [];
        for (let p of info.walls) {
            allWalls.push(new Wall(parseInt(p.row), parseInt(p.column)));
        }


        var allDoors = [];
        for (let d of info.doors) {
            allDoors.push(new Door(parseInt(d.row), parseInt(d.column),d.color));
        }

        var allKeys = [];
        for (let k of info.keys) {
            allKeys.push(new Key(parseInt(k.row), parseInt(k.column),k.color));
        }

        var allNinjase = [];
        let n = info.ninjase;
        allNinjase.push(new Ninjase(parseInt(n.row),parseInt(n.column), null));

        
        //Coordinates of Keys
        for (let loc of info.keys){
            let coord = new Coordinate(parseInt(loc.row),parseInt(loc.column));
        }

        // //Coordinates of Ninjase?
        // let loc = info.ninjase
        // let coord = new Coordinate(parseInt(loc.row),parseInt(loc.column));


        //initialize
        this.configuration = new Configuration(numRows,numColumns,ninjase)
        this.configuration.initialize(allWalls,allKeys,allDoors,allNinjase);
        this.numMoves = 0;
        this.victory = false;
    }
}