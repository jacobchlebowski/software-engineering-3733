export class MoveType{
    constructor (dr,dc) {
        this.deltar = dr;
        this.deltac = dc;
    }
    
    static parse(s){
        if ((s==="down") || (s==="Down")) {return Down;}
        if ((s==="up") || (s==="Up")) {return Up;}
        if ((s==="left") || (s==="Left")) {return Left;}
        if ((s==="right") || (s==="Right")) {return Right;}
        
        return NoMove;
    }
}

export const Down = new MoveType(1,0,"down");
export const Up   = new MoveType(-1,0,"up");
export const Left = new MoveType(0,-1,"left");
export const Right= new MoveType(0,1,"right");
export const NoMove=new MoveType(0,0,"*"); //No move is possible



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
    
    *coordinates(){
        yield new Coordinate(this.row,this.column);
    }
    
    
    contains(coord){
        let cs = [...this.cordinates()];
        for(let c of cs){
            if(c.row === coord.row && c.column === coord.column){
                return true;
            }
        }
        return false;
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
    move(direction){
        this.row += direction.deltar;
        this.column += direction.deltac;
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
    
    /**Determines if any walls in the puzzle covers given coordinates */
    isCovered(coord){
        let idx = this.walls.findIndex(wall => wall.contains(coord));
        //if we found a wall that covers coordinate, return true; otherwise false.
        return idx >= 0;
    }
    
    
    availableMoves(){
        let p = this.ninjase;
        if (p == null) {return []; }
        let moves = [];
        let coord = new Coordinate(p.row,p.column);
        
        //can ninjase move left?
        let available = false;
        if(coord.column > 0){
            available=true;
            for(let r = 0; r < 1; r++){
                if(this.isCovered(new Coordinate(coord.row+r, coord.column-1))){
                    available = false;
                    break;
                }
            }
        }
        if(available){
            moves.push(Left);
        }
        
        
        available = false;
        //can ninjase move right?
        if(coord.column < this.numColumns){
            available = true;
                if(this.isCovered(new Coordinate(coord.row-1, coord.column))){
                    available=false;
                }
        }
        if(available){
            moves.push(Right);
        }
        
        
        //can ninjase move down?
        if(coord.row < this.numRows){
            available = true;
            for(let c = 0; c < 1; c++){
                if(this.isCovered(new Coordinate(coord.row+1, coord.column+c))){
                    available = false;
                    break;
                }
            }
        }
        if(available){
            moves.push(Down);
        }
        
        
        return moves;
    }
    
    
    clone(){
        let copy = new Configuration(this.numsRows, this.numColumns, this.ninjase);
        copy.walls = [];
        copy.keys =  [];
        copy.doors = [];
        for(let w of this.walls){
            let dup = w.copy();
            copy.walls.push(dup);
        }
        for(let k of this.keys){
            let dup = k.copy();
            copy.keys.push(dup);
        }
        for(let d of this.doors){
            let dup = d.copy();
            copy.doors.push(dup);
        }
        for(let n of this.ninjase){
            let dup = n.copy();
            copy.ninjase.push(dup)
        }
        return copy;
    }
    
    
    
}


export default class Model {
    //info is going to be JSON-encoded configuration
    constructor(info) {
        this.initialize(info);
        this.info = info;
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
    
    updateMoveCount(delta){
        this.numMoves += delta;
    }
    
    numberMoves(){
        return this.numMoves;
    }
    
    
    available(direction){
        if(direction === NoMove) {return false;}
        let allMoves = this.configuration.availableMoves();
        return allMoves.includes(direction);
    }
    
    copy(){
        let m = new Model(this.info);
        m.configuration = this.configuration.clone();
        m.numMoves = this.numMoves;
        m.victory = this.victory;
        return m;
    }
}