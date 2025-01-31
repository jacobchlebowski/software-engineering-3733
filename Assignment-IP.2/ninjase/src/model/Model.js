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

    *coordinates(){
        yield new Coordinate(this.row,this.column);
    }

    contains(coord) {
        let cs = [...this.coordinates()];   // javascript one liner.... turn all of those yield into a list.
        for (let c of cs) {
            if (c.row === coord.row && c.column === coord.column) { 
                return true; 
            } 
        }
        
        return false;
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

    *coordinates(){
        yield new Coordinate(this.row,this.column);
    }
    
    contains(coord) {
        let cs = [...this.coordinates()];   // javascript one liner.... turn all of those yield into a list.
        for (let c of cs) {
            if (c.row === coord.row && c.column === coord.column) { 
                return true; 
            } 
        }
        
        return false;
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
    
    
    contains(coord) {
        let cs = [...this.coordinates()];   // javascript one liner.... turn all of those yield into a list.
        for (let c of cs) {
            if (c.row === coord.row && c.column === coord.column) { 
                return true; 
            } 
        }
        
        return false;
    }
    
    
    copy(){
        let w = new Wall(this.row,this.column);
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
        this.column += direction.deltac;
        this.row += direction.deltar;
    }
    
    location() {
        return new Coordinate(this.row,this.column);
    }
    currentColor(){
        if(this.currentKey === null){
            return "No key"
        }else{
            return this.currentKey[0].color
        }
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

    /**Determines if any keys in the puzzle covers given coordinates (of ninjase) */
    isCoveredDoor(coord){
        let idx = this.doors.findIndex(door => door.contains(coord));
        
        //if we found a key that covers coordinate, return true; otherwise false.
        return idx >= 0;
    }
    isCoveredDoorIndex(coord){
        let idx = this.doors.findIndex(door => door.contains(coord));
        
        //if we found a key that covers coordinate, return true; otherwise false.
        return idx;
    }

    /**Determines if any keys in the puzzle covers given coordinates (of ninjase) */
    isCoveredKey(coord){
        let idx = this.keys.findIndex(key => key.contains(coord));
        
        //if we found a key that covers coordinate, return true; otherwise false.
        return idx;
    }

    deleteDoor(coord){
        let index = this.isCoveredDoorIndex(coord)
        this.doors.splice(index,1)
        this.ninjase[0].currentKey = null
    }
    victory(){
        if(this.doors.length===0){
            return "VICTORY!"
        }else{
            return ""
        }
    }

    
    keyPickUp() {

        //IF NINJASE IS ON KEY
        if(  (this.isCoveredKey(new Coordinate(this.ninjase[0].row, this.ninjase[0].column))) >= 0  ){
            //INDEX OF KEY
            let index = (this.isCoveredKey(new Coordinate(this.ninjase[0].row, this.ninjase[0].column)))
            //NINJASE PICKUP KEY
        
            //if ninjase is not already holding a key... just pick it up...
            if(this.ninjase[0].currentKey==null){
                //remove KEY from ARRAY AND GIVE TO NINJASE
                if(index > -1){
                    let key = this.keys.splice(index,1)
                    this.ninjase[0].currentKey=key
                }
            }
            //if ninjase is already holding a key...DROP current key and pickup new one
            else{
                //recognize key on ground...old key on reserve
                let oldKey = this.ninjase[0].currentKey
                oldKey[0].row = this.ninjase[0].row
                oldKey[0].column = this.ninjase[0].column

                oldKey[0].color = this.ninjase[0].currentKey[0].color
               
                
                if(index > -1){
                    let newKey = this.keys.splice(index,1)
                    this.ninjase[0].currentKey=newKey
                }

                this.keys.push(oldKey[0])
            }
            
            
        }
    }



 
    
    
    availableMoves(currentLevelRows){
        let p = this.ninjase[0];
        if (p == null) {return []; }
        let moves = [];
        let coord = this.ninjase[0].location();

        //can ninjase move up?
        let available = false
        if(coord.row > 0){
            available=true;
            let newCoordRowUp = coord.row-1
            if (this.isCovered(new Coordinate(newCoordRowUp, coord.column))) {
                available=false;
            }
            if(this.isCoveredDoor(new Coordinate(newCoordRowUp, coord.column))){ //CHECK DOOR HERE
                available=false;
                //INDEX OF DOOR & DOOR COLOR
                let index = (this.isCoveredDoorIndex(new Coordinate(this.ninjase[0].row-1, this.ninjase[0].column)))
                let doorColor = this.doors[index].color
                if(this.ninjase[0].currentKey === null){
                    available=false;
                }else if (this.ninjase[0].currentKey[0].color === doorColor){
                    //NINJASE CAN NOW WALK THROUGH CORRECT DOOR OF KEY COLOR!
                    available=true;
                }
            }
        }
        if(available){
            moves.push(Up);
        }


        //can ninjase move down?
        available = false
        if(coord.row < currentLevelRows-1){
            available = true;
            let newCoordRowDown = coord.row+1
            if(this.isCovered(new Coordinate(newCoordRowDown, coord.column))){
                available=false;
            }
            if(this.isCoveredDoor(new Coordinate(newCoordRowDown, coord.column))){ //CHECK DOOR HERE
                available=false;
                //INDEX OF DOOR & DOOR COLOR
                let index = (this.isCoveredDoorIndex(new Coordinate(this.ninjase[0].row+1, this.ninjase[0].column)))
                let doorColor = this.doors[index].color
                if(this.ninjase[0].currentKey === null){
                    available=false;
                }else if (this.ninjase[0].currentKey[0].color === doorColor){
                    //NINJASE CAN NOW WALK THROUGH CORRECT DOOR OF KEY COLOR!
                    available=true;
                }
            }
            
        }
        if(available){
            moves.push(Down);
        }


        //can ninjase move right? //ALSO CHECK NOW IF DOOR IS THERE CAN NINJASE MOVE INTO DOOR
        available = false
        if(coord.column < this.numColumns-1){
            available = true;
            let newCoordColumnRight = coord.column+1
            if(this.isCovered(new Coordinate(coord.row, newCoordColumnRight))){
                available=false;
            }
            if(this.isCoveredDoor(new Coordinate(coord.row, newCoordColumnRight))){ //CHECK DOOR HERE
                available=false;
                //INDEX OF DOOR & DOOR COLOR
                let index = (this.isCoveredDoorIndex(new Coordinate(this.ninjase[0].row, this.ninjase[0].column+1)))
                let doorColor = this.doors[index].color
                if(this.ninjase[0].currentKey === null){
                    available=false;
                }else if (this.ninjase[0].currentKey[0].color === doorColor){
                    //NINJASE CAN NOW WALK THROUGH CORRECT DOOR OF KEY COLOR!
                    available=true;
                }
            }
        }
        if(available){
            moves.push(Right);
        }
        

        //can ninjase move left?
        available = false
        if(coord.column > 0){
            available = true;
            let newCoordColumnLeft = coord.column-1
            if(this.isCovered(new Coordinate(coord.row, newCoordColumnLeft))){
                available=false;
            }
            if(this.isCoveredDoor(new Coordinate(coord.row, newCoordColumnLeft))){ //CHECK DOOR HERE
                available=false;
                //INDEX OF DOOR & DOOR COLOR
                let index = (this.isCoveredDoorIndex(new Coordinate(this.ninjase[0].row, this.ninjase[0].column-1)))
                let doorColor = this.doors[index].color
                if(this.ninjase[0].currentKey === null){
                    available=false;
                }else if (this.ninjase[0].currentKey[0].color === doorColor){
                    //NINJASE CAN NOW WALK THROUGH CORRECT DOOR OF KEY COLOR!
                    available=true;
                }
            }
        }
        if(available){
            moves.push(Left);
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

        let dup = this.ninjase[0].copy();
        this.ninjase = dup
      
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
    
    
    available(direction, currentLevel){
        let currentLevelRows = currentLevel.rows
        if(direction === NoMove) {return false;}
        let allMoves = this.configuration.availableMoves(currentLevelRows);
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